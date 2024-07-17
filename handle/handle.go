package handle

import (
	"bytes"
	// "database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"io"
	"time"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/gorilla/mux"
	// "github.com/gorilla/sessions"
	// "github.com/gorilla/sessions"
	// "github.com/gorilla/mux"
)

// TODO refactor handleupload and handlereplace
func HandleUploadLas() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
 		vars := mux.Vars(r)
 		jobId := vars["id"]

		r.ParseMultipartForm(40 << 20)

		file, fileHeader, err := r.FormFile("file")
		if err != nil {
			fmt.Println("error recieving file from form")
			http.Error(w, "Error recieving file from form", http.StatusInternalServerError)
			return
		}

		defer file.Close()

		homeDir, err := os.UserHomeDir()
		if err != nil {
			log.Fatalf("Error getting user's home directory: %v", err)
		}

		baseDir := filepath.Join(homeDir, "pivot/uploads")
		lasfolderPath := filepath.Join(baseDir, jobId)

		if err := os.MkdirAll(lasfolderPath, os.ModePerm); err != nil {
			http.Error(w, "Error creating uploads folder", http.StatusInternalServerError)
			return
		}

		filePath := filepath.Join(lasfolderPath, fmt.Sprintf(fileHeader.Filename))

		fmt.Println("filePath: ", filePath)

		_, err = os.Stat(filePath)
		if err == nil {
			http.Error(w, "File already exists. Do you want to replace it?", http.StatusConflict)
			return
		} else if !os.IsNotExist(err) {
			http.Error(w, "Error checking file existence", http.StatusInternalServerError)
			return
		}

		outFile, err := os.Create(filePath)
		if err != nil {
			http.Error(w, "Unable to create file on server", http.StatusInternalServerError)
			return
		}
		defer outFile.Close()

		if _, err := io.Copy(outFile, file); err != nil {
			http.Error(w, "Error copying file contents to file", http.StatusInternalServerError)
			return
		}

		// Store metadata
		fileSize := fileHeader.Size
		uploadTime := time.Now()
		err = StoreFileMetadata(fileHeader.Filename, fileSize, uploadTime, filePath)
		if err != nil {
			http.Error(w, "Error storing file metadata", http.StatusInternalServerError)
			return
		}

		err = convertToOctree(lasfolderPath, filePath, strings.TrimSuffix(fileHeader.Filename, filepath.Ext(fileHeader.Filename)))
		if err != nil {
		 http.Error(w, err.Error(), http.StatusInternalServerError)
		 return
		}

		response := map[string]interface{}{
			"message": "File uploaded successfully",
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}
}

func StoreFileMetadata(fileName string, fileSize int64, uploadTime time.Time, filePath string) error {
	// Metadata object
	metadata := map[string]interface{}{
			"fileName":   fileName,
			"fileSize":   fileSize,
			"uploadTime": uploadTime.Format("2006-01-02 15:04:05"),
	}

	// Convert metadata to JSON
	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
			return err
	}

	// Write metadata to a .metadata file alongside the uploaded file
	metadataFilePath := filePath + ".metadata"
	err = ioutil.WriteFile(metadataFilePath, metadataJSON, 0644)
	if err != nil {
			return err
	}

	return nil
}

func HandleReplaceLas() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(40 << 20)

		file, fileHeader, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Error receiving file from form", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		vars := mux.Vars(r)
		jobId := vars["id"]

		homeDir, err := os.UserHomeDir()
		if err != nil {
			log.Fatalf("Error getting user's home directory: %v", err)
		}

		baseDir := filepath.Join(homeDir, "pivot/uploads")
		lasfolderPath := filepath.Join(baseDir, jobId)

		if err := os.MkdirAll(lasfolderPath, os.ModePerm); err != nil {
			http.Error(w, "Error creating uploads folder", http.StatusInternalServerError)
			return
		}

		filePath := filepath.Join(lasfolderPath, fmt.Sprintf(fileHeader.Filename))

		if _, err := os.Stat(filePath); err == nil {
			if err := os.Remove(filePath); err != nil {
				http.Error(w, "Error deleting existing file", http.StatusInternalServerError)
				return
			}
		}

		outFile, err := os.Create(filePath)
		if err != nil {
			fmt.Println("error copying file contents to file")
			http.Error(w, "Unable to create file on server", http.StatusInternalServerError)
			return
		}
		defer outFile.Close()

		if _, err := io.Copy(outFile, file); err != nil {
			fmt.Println("error copying file contents to file")
			http.Error(w, "Error copying file contents to file", http.StatusInternalServerError)
			return
		}

		// Store metadata
		fileSize := fileHeader.Size
		uploadTime := time.Now()
		err = StoreFileMetadata(fileHeader.Filename, fileSize, uploadTime, filePath)
		if err != nil {
			http.Error(w, "Error storing file metadata", http.StatusInternalServerError)
			return
		}

		err = convertToOctree(lasfolderPath, filePath,  strings.TrimSuffix(fileHeader.Filename, filepath.Ext(fileHeader.Filename)))
		if err != nil {
		 http.Error(w, err.Error(), http.StatusInternalServerError)
		 return
		}

		response := map[string]interface{}{
			"message": "File uploaded successfully",
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}
}

func convertToOctree(folderPath, lasFilePath, name string) error {
  // Invoke PotreeConverter process
  potreeConverterPath := "/home/ja/pivot/PotreeConverter"

  outputDir := filepath.Join(folderPath, name)
  cmd := exec.Command(potreeConverterPath, lasFilePath, "-o", outputDir)
  cmd.Stdout = os.Stdout
  cmd.Stderr = os.Stderr

  err := cmd.Start()
  if err != nil {
    return fmt.Errorf("error starting PotreeConverter process")
  }


	// Channel to listen for interrupt signal
	done := make(chan error, 1)
	go func() {
		done <- cmd.Wait()
	}()

	// Handle interrupt signal to terminate the process gracefully
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)

	select {
	case <-sig:
		// Terminate the process
		err := cmd.Process.Signal(os.Interrupt)
		if err != nil {
			log.Printf("Error sending interrupt signal to PotreeConverter process: %v\n", err)
		}
		log.Println("PotreeConverter process terminated by interrupt signal.")
	case err := <-done:
		if err != nil {
			return fmt.Errorf("error waiting for PotreeConverter process to finish: %v", err)
		}
		log.Println("PotreeConverter process completed successfully.")
	}

	return nil
  //err = cmd.Wait()
  //if err != nil {
  //  return fmt.Errorf("Error waiting for PotreeConverter process to finish")
  //}

  //return nil
}


type FileMetadata struct {
	FileName   string `json:"fileName"`
	FileSize   int64  `json:"fileSize"`
	UploadTime string `json:"uploadTime"`
}
func HandleGetLasFiles() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		jobId := vars["id"]

		homeDir, err := os.UserHomeDir()
		if err != nil {
			log.Fatalf("Error getting user's home directory: %v", err)
		}

		baseDir := filepath.Join(homeDir, "pivot/uploads")
		folderPath := filepath.Join(baseDir, jobId)

		if _, err := os.Stat(folderPath); os.IsNotExist(err) {
			// Return an empty array if the directory doesn't exist
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("[]")) // Empty JSON array
			return
		} else if err != nil {
			log.Printf("Error checking directory: %v", err)
			http.Error(w, "Error checking directory", http.StatusInternalServerError)
			return
		}
		files, err := os.ReadDir(folderPath)
		if err != nil {
			log.Printf("Error reading directory: %v", err)
			http.Error(w, "Error reading directory", http.StatusInternalServerError)
			return
		}

		var lasFiles []FileMetadata

		for _, file := range files {
			if !file.IsDir() && filepath.Ext(file.Name()) == ".las" {
				filePath := filepath.Join(folderPath, file.Name())
				metaFilePath := filePath + ".metadata"

				// Read metadata file
				metaFileBytes, err := ioutil.ReadFile(metaFilePath)
				if err != nil {
					log.Printf("Error reading metadata file %s: %v", metaFilePath, err)
					continue
				}

				// Parse metadata JSON
				var metadata FileMetadata
				err = json.Unmarshal(metaFileBytes, &metadata)
				if err != nil {
					log.Printf("Error unmarshaling metadata for file %s: %v", file.Name(), err)
					continue
				}

				// Append metadata to list
				lasFiles = append(lasFiles, metadata)
			}
		}

		// Encode lasFiles slice to JSON
		responseJSON, err := json.Marshal(lasFiles)
		if err != nil {
			log.Printf("Error marshaling JSON: %v", err)
			http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
			return
		}

		// Set Content-Type header and write JSON response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(responseJSON)
	}
}

func HandleDeleteLas() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		jobId := vars["id"]
		fileName := vars["fileName"]


		homeDir, err := os.UserHomeDir()
    if err != nil {
        log.Fatalf("Error getting user's home directory: %v", err)
        http.Error(w, "Error getting user's home directory", http.StatusInternalServerError)
        return
    }

    baseDir := filepath.Join(homeDir, "pivot/uploads")
    filePath := filepath.Join(baseDir, jobId, fileName)
		fmt.Println(filePath)

    err = os.Remove(filePath)
    if err != nil {
        log.Printf("Error deleting file: %v", err)
        http.Error(w, "Error deleting file", http.StatusInternalServerError)
        return
    }

		filePath = filepath.Join(baseDir, jobId, fileName + ".metadata") 
    err = os.Remove(filePath)
    if err != nil {
        log.Printf("Error deleting file: %v", err)
        http.Error(w, "Error deleting file", http.StatusInternalServerError)
        return
    }

		folderPath := filepath.Join(baseDir, jobId, strings.TrimSuffix(fileName, filepath.Ext(fileName)))
		os.RemoveAll(folderPath)
    response := map[string]interface{}{
        "message": "File deleted successfully",
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
	}
}
// func HandleGetLasFiles() http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		vars := mux.Vars(r)
// 		jobId := vars["id"]

// 		fmt.Println("HERE")
// 		homeDir, err := os.UserHomeDir()
// 		if err != nil {
// 			log.Fatalf("Error getting user's home directory: %v", err)
// 		}

// 		baseDir := filepath.Join(homeDir, "pivot/uploads")
// 		folderPath := filepath.Join(baseDir, jobId)

// 		files, err := os.ReadDir(folderPath)
// 		if err != nil {
// 			log.Printf("Error reading directory: %v", err)
// 			http.Error(w, "Error reading directory", http.StatusInternalServerError)
// 			return
// 		}

// 		var lasFiles []string

// 		for _, file := range files {
// 			if !file.IsDir() && filepath.Ext(file.Name()) == ".las" {
// 				lasFiles = append(lasFiles, file.Name())
// 			}
// 		}

// 		// Encode lasFiles slice to JSON
// 		responseJSON, err := json.Marshal(lasFiles)
// 		if err != nil {
// 			log.Printf("Error marshaling JSON: %v", err)
// 			http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
// 			return
// 		}

// 		// Set Content-Type header and write/filepath JSON response
// 		w.Header().Set("Content-Type", "application/json")
// 		w.WriteHeader(http.StatusOK)
// 		w.Write(responseJSON)

// 	}
// }

// func convertToOctree(folderPath, lasFilePath, jobId string) error {
// 	// Get user's home directory
// 	homeDir, err := os.UserHomeDir()
// 	if err != nil {
// 			return fmt.Errorf("error getting user's home directory: %v", err)
// 	}

// 	// Path to PotreeConverter executable
// 	potreeConverterPath := filepath.Join(homeDir, "pivot", "PotreeConverter")

// 	// Construct output directory path
// 	outputDir := filepath.Join(folderPath, jobId)

// 	// Ensure outputDir exists; create if not
// 	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
// 			return fmt.Errorf("failed to create output directory: %v", err)
// 	}

// 	// Create command to run PotreeConverter
// 	cmd := exec.Command(potreeConverterPath, lasFilePath, "-o", outputDir)
// 	cmd.Stdout = os.Stdout
// 	cmd.Stderr = os.Stderr

// 	// Start PotreeConverter process
// 	if err := cmd.Start(); err != nil {
// 			return fmt.Errorf("error starting PotreeConverter process: %v", err)
// 	}

// 	// Channel to listen for interrupt signal
// 	done := make(chan error, 1)
// 	go func() {
// 			done <- cmd.Wait()
// 	}()

// 	// Handle interrupt signal to terminate the process gracefully
// 	sig := make(chan os.Signal, 1)
// 	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)

// 	select {
// 	case <-sig:
// 			// Terminate the process
// 			err := cmd.Process.Signal(os.Interrupt)
// 			if err != nil {
// 					log.Printf("Error sending interrupt signal to PotreeConverter process: %v\n", err)
// 			}
// 			log.Println("PotreeConverter process terminated by interrupt signal.")
// 	case err := <-done:
// 			if err != nil {
// 					return fmt.Errorf("error waiting for PotreeConverter process to finish: %v", err)
// 			}
// 			log.Println("PotreeConverter process completed successfully.")
// 	}

// 	return nil
// }

// func convertToOctree(folderPath, lasFilePath, jobId string) error {
// 	// Invoke PotreeConverter process
// 	potreeConverterPath := "~/pivot/PotreeConverter"

// 	outputDir := filepath.Join(folderPath, jobId)
// 	if err := os.MkdirAll(outputDir, os.ModePerm); err != nil {
// 		return fmt.Errorf("failed to create output directory: %v", err)
// 	}

// 	cmd := exec.Command(potreeConverterPath, lasFilePath, "-o", outputDir)
// 	cmd.Stdout = os.Stdout
// 	cmd.Stderr = os.Stderr
// 	fmt.Println(cmd)

// 	err := cmd.Start()
// 	if err != nil {
// 		return fmt.Errorf("Error starting PotreeConverter process")
// 	}

// 	// Channel to listen for interrupt signal
// 	done := make(chan error, 1)
// 	go func() {
// 		done <- cmd.Wait()
// 	}()

// 	// Handle interrupt signal to terminate the process gracefully
// 	sig := make(chan os.Signal, 1)
// 	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)

// 	select {
// 	case <-sig:
// 		// Terminate the process
// 		err := cmd.Process.Signal(os.Interrupt)
// 		if err != nil {
// 			log.Printf("Error sending interrupt signal to PotreeConverter process: %v\n", err)
// 		}
// 		log.Println("PotreeConverter process terminated by interrupt signal.")
// 	case err := <-done:
// 		if err != nil {
// 			return fmt.Errorf("Error waiting for PotreeConverter process to finish: %v", err)
// 		}
// 		log.Println("PotreeConverter process completed successfully.")
// 	}

// 	return nil
// 	//err = cmd.Wait()
// 	//if err != nil {
// 	//  return fmt.Errorf("Error waiting for PotreeConverter process to finish")
// 	//}

// 	//return nil
// }


func HandleGetPoleLocations() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		jobId := vars["id"]

		// var lidarIsUploaded bool
		// err := db.QueryRow(`SELECT lidar_uploaded FROM jobs WHERE id = $1`, jobId).Scan(&lidarIsUploaded)
		// if err != nil {
		// 	http.Error(w, "Error fetching lidar uploaded status", http.StatusInternalServerError)
		// 	return
		// }

		// if lidarIsUploaded {
			// var adminId string
			// query := `SELECT admin_id FROM jobs WHERE id = $1`
			// err = db.QueryRow(query, jobId).Scan(&adminId)
			// if err != nil {
			// 	fmt.Println("failed to get jobs")
			// 	http.Error(w, "Error getting admin id from jobs", http.StatusInternalServerError)
			// 	return
			// }

			homeDir, err := os.UserHomeDir()
			if err != nil {
				log.Fatalf("Error getting user's home directory: %v", err)
			}

			filePath := filepath.Join(homeDir, "pivot/uploads", jobId, fmt.Sprintf("%s.las", jobId))
			fmt.Println(filePath)

			fileContent, err := ioutil.ReadFile(filePath)
			if err != nil {
				http.Error(w, "Error reading LAS file", http.StatusInternalServerError)
				return
			}

			pythonScriptPath := "/home/ja/pivot/scripts/get-pole-locations.py"

			cmd := exec.Command("python3", pythonScriptPath)

			cmd.Stdin = bytes.NewReader(fileContent)

			var out bytes.Buffer
			cmd.Stdout = &out

			err = cmd.Run()
			if err != nil {
				http.Error(w, "Error executing Python script: "+err.Error(), http.StatusInternalServerError)
				return
			}

			poleData := []byte(out.String())
			// err = savePolesToDatabase(db, jobId, poleData)
			if err != nil {
				http.Error(w, "Error saving pole json file to database: "+err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			_, err = w.Write(poleData)

			if err != nil {
				http.Error(w, "Error writing response: "+err.Error(), http.StatusInternalServerError)
				return
			}
		// } else {
		// 	http.Error(w, "Las file has not been uploaded. Upload las file to get pole locations", http.StatusForbidden)
		// 	return
		// }
	}
}

// func savePolesToDatabase(db *sql.DB, jobId string, poleData []byte) error {
// 	query := `UPDATE jobs SET poles = $1 WHERE id = $2`

// 	_, err := db.Exec(query, poleData, jobId)
// 	if err != nil {
// 		return err
// 	}

// 	fmt.Println("no error saving to database")
// 	return nil
// }

// func HandleSavePathsOfPoleLine(store *sessions.CookieStore, db *sql.DB) http.HandlerFunc {
// 	return func(w http.ResponseWriter, r *http.Request) {
// 		vars := mux.Vars(r)
// 		jobId := vars["id"]

// 		midspanData, err := io.ReadAll(r.Body)
// 		if err != nil {
// 			http.Error(w, "Error reading JSON data: "+err.Error(), http.StatusBadRequest)
// 			return
// 		}

// 		err = saveMidspansToDatabase(db, jobId, midspanData)
// 		if err != nil {
// 			http.Error(w, "Error saving midspans json file to database: "+err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		response := map[string]interface{}{
// 			"message": "JSON data received and saved successfully",
// 		}

// 		jsonResponse, err := json.Marshal(response)
// 		if err != nil {
// 			http.Error(w, "Error encoding JSON response: "+err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		w.Header().Set("Content-Type", "application/json")
// 		w.WriteHeader(http.StatusOK)
// 		w.Write(jsonResponse)
// 	}
// }

// func saveMidspansToDatabase(db *sql.DB, jobId string, midspanData []byte) error {
// 	query := `UPDATE jobs SET midspans = $1 WHERE id = $2`

// 	_, err := db.Exec(query, midspanData, jobId)
// 	if err != nil {
// 		return fmt.Errorf("error updating markers for job %s: %v", jobId, err)
// 	}

// 	fmt.Println("no error saving to database")
// 	return nil
// }

// PRE-CONDITIONS
// lidar data, midspans collected from user, pole locations
//func HandleGetVegetationEncroachments(store *sessions.CookieStore, db *sql.DB) http.HandlerFunc {
//  return func(w http.ResponseWriter, r *http.Request) {
//    vars := mux.Vars(r)
//    jobId := vars["id"]
//
//    // FIRST CHECK: need midspans from user
//    var midspans sql.NullString
//    query = `SELECT midspans FROM jobs WHERE id = $1`
//    err := db.QueryRow(query, jobId).Scan(&midspans)
//    if err != nil {
//      http.Error(w, "Error fetching vegetation check from database", http.StatusInternalServerError)
//      return
//    }
//
//    if !midspans.Valid {
//      http.Error(w, "Midspans must first be collected before getting vegetation encroachments", http.StatusBadRequest)
//      return
//    }
//
//    midspansJSON, err := json.Marshal(midspans.String)
//    if err != nil {
//      http.Error(w, "Error encoding JSON (midspans) response: "+err.Error(), http.StatusInternalServerError)
//      return
//    }
//
//    var vegetation sql.NullString
//    query = `SELECT vegetation FROM jobs WHERE id = $1`
//    err := db.QueryRow(query, jobId).Scan(&vegetation)
//    if err != nil {
//      http.Error(w, "Error fetching vegetation check from database", http.StatusInternalServerError)
//      return
//    }
//
//    if vegetation.Valid {
//      jsonResponse, err := json.Marshal(vegetation.String)
//      if err != nil {
//        http.Error(w, "Error encoding JSON (vegetation) response: "+err.Error(), http.StatusInternalServerError)
//        return
//      }
//
//      w.Header().Set("Content-Type", "application/json")
//      w.WriteHeader(http.StatusOK)
//      w.Write(jsonResponse)
//
//    } else {
//      var adminId string
//      query := `SELECT admin_id FROM jobs WHERE id = $1`
//      err := db.QueryRow(query, jobId).Scan(&adminId)
//
//      if err != nil {
//        fmt.Println("failed to get jobs")
//        http.Error(w, "Error getting admin id from jobs", http.StatusInternalServerError)
//        return
//      }
//
//      homeDir, err := os.UserHomeDir()
//      if err != nil {
//        log.Fatalf("Error getting user's home directory: %v", err)
//      }
//
//      filePath := filepath.Join(homeDir, "pivot/uploads", adminId, fmt.Sprintf("%s.las", jobId))
//
//      fileContent, err := ioutil.ReadFile(filePath)
//      if err != nil {
//        http.Error(w, "Error reading LAS file", http.StatusInternalServerError)
//        return
//      }
//
//      pythonScriptPath := "/home/ja/pivot/static/scripts/get-vegetation-encroachments.py"
//
//      cmd := exec.Command("python3", pythonScriptPath, string(midspansJSON))
//
//      cmd.Stdin = bytes.NewReader(fileContent)
//
//      var out bytes.Buffer
//      cmd.Stdout = &out
//
//      err = cmd.Run()
//      if err != nil {
//          http.Error(w, "Error executing Python script: "+err.Error(), http.StatusInternalServerError)
//          return
//      }
//
//      vegetationData := []byte(out.String())
//      err = saveVegetationToDatabase(db, jobId, vegetationData)
//      if err != nil {
//        http.Error(w, "Error saving pole json file to database: "+err.Error(), http.StatusInternalServerError)
//        return
//      }
//
//      w.Header().Set("Content-Type", "application/json")
//      w.WriteHeader(http.StatusOK)
//      _, err = w.Write(vegetationData)
//
//      if err != nil {
//          http.Error(w, "Error writing response: "+err.Error(), http.StatusInternalServerError)
//          return
//      }
//    }
//  }
//}
//
//func saveVegetationToDatabase(db *sql.DB, jobId string, vegetationData []byte) error {
//  query := `UPDATE jobs SET vegetation = $1 WHERE id = $2`
//	_, err := db.Exec(query, vegetationData, jobId)
//	if err != nil {
//		return err
//	}
//	return nil
//}
