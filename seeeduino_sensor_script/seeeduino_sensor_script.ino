// WiFi
// Admin, ‘Getting Started with Seeed XIAO ESP32-C3 Board’, How To Electronics. Accessed: Mar. 29, 2024. [Online]. 
// Available: https://how2electronics.com/getting-started-with-seeed-xiao-esp32-c3-board/

// Lighting:
// ‘Adafruit VEML7700 Ambient Light Sensor’, Adafruit Learning System. Accessed: Apr. 12, 2024. [Online]. 
// Available: https://learn.adafruit.com/adafruit-veml7700/overview

// Moisture:
// ‘Adafruit STEMMA Soil Sensor - I2C Capacitive Moisture Sensor’, Adafruit Learning System. Accessed: Apr. 15, 2024 [Online]. 
// Available: https://learn.adafruit.com/adafruit-stemma-soil-sensor-i2c-capacitive-moisture-sensor/arduino-test

#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include "Adafruit_VEML7700.h"
#include "Adafruit_seesaw.h"

Adafruit_VEML7700 veml = Adafruit_VEML7700(); // Light sensor
Adafruit_seesaw ss; // Moisture sensor

const char* ssid = "Rebellious-Amish-Family-Mobile";
const char* password = "123456789";
const char* apiEndpoint = "http://192.168.185.191:3000";              

WebServer server(80);

float Lighting;
float Moisture;
 
void setup() {
  Serial.begin(115200);
 
  // ------------ WIFI ------------
  Serial.println("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
 
  //check wi-fi is connected
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.println("");
  Serial.println("WiFi connected!");

  // set up server
  server.on("/", handle_OnConnect);
  server.onNotFound(handle_NotFound);
 
  server.begin();
  Serial.println("HTTP server started");
  Serial.println(WiFi.localIP());


  // ------------ Lighting ------------
  while (!Serial) { delay(10); }
  Serial.println("Adafruit VEML7700 Test");

  if (!veml.begin()) {
    Serial.println("Sensor not found");
    while (1);
  }
  Serial.println("Sensor found");

  // ------------ Moisture ------------
  if (!ss.begin(0x36)) {
    Serial.println("ERROR! seesaw not found");
    while(1) delay(1);
  } else {
    Serial.print("seesaw started! version: ");
    Serial.println(ss.getVersion(), HEX);
  }
}

void loop() {
  server.handleClient();
}

void handle_OnConnect() {

  // ------------ Lighting ------------

  Lighting = veml.readLux();
  Serial.print("lux: "); Serial.println(Lighting);
  // Serial.print("raw ALS: "); Serial.println(veml.readALS());
  // Serial.print("raw white: "); Serial.println(veml.readWhite());

  // ------------ Moisture ------------
  float Temperature = ss.getTemp();
  uint16_t Moisture = ss.touchRead(0) - 300; // -300 as sensor ranges from 300 ~ 500

  Serial.print("Temperature: "); Serial.print(Temperature); Serial.println("*C");
  Serial.print("Capacitive: "); Serial.println(Moisture);

  // ------------ Send to API ------------
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiEndpoint);
    http.addHeader("Content-Type", "application/json");

    String dataToSend = "{\"lighting\":\"" + String(Lighting) + "\",\"temperature\":\"" + String(Temperature) + "\",\"moisture\":\"" + String(Moisture) + "\"}";

    int httpResponseCode = http.PUT(dataToSend);
    if (httpResponseCode > 0) {
      Serial.println("Success!");
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    }
    else {
      Serial.print("Error in HTTP request: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
}

void handle_NotFound(){
  server.send(404, "text/plain", "Not found");
}