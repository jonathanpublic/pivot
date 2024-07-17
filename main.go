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
	corsHandler := handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowCredentials(),
	)
	r.Handle("/uploadLas/{id}", corsHandler(http.HandlerFunc(handle.HandleUploadLas()))).Methods("POST")
	r.Handle("/replaceLas/{id}", corsHandler(http.HandlerFunc(handle.HandleReplaceLas()))).Methods("POST")
	r.Handle("/getPoleLocations/{id}", corsHandler(http.HandlerFunc(handle.HandleReplaceLas()))).Methods("GET")

	log.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
