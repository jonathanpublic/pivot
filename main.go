package main

import (
	"log"
	"net/http"

	"github.com/Justin-Akridge/pivot/handle"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	 // CORS configuration
	corsHandler := handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowCredentials(),
	)

	r.Handle("/uploadLas/{id}", corsHandler(http.HandlerFunc(handle.HandleUploadLas()))).Methods("POST")
	r.Handle("/replaceLas/{id}", corsHandler(http.HandlerFunc(handle.HandleReplaceLas()))).Methods("POST")
	r.Handle("/lasFiles/{id}", corsHandler(http.HandlerFunc(handle.HandleGetLasFiles()))).Methods("GET")
	r.Handle("/getPoleLocations/{id}", corsHandler(http.HandlerFunc(handle.HandleReplaceLas()))).Methods("GET")
	r.Handle("/deleteFile/{id}/{fileName}", corsHandler(http.HandlerFunc(handle.HandleDeleteLas())))

	log.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
