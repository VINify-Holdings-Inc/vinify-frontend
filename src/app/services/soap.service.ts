import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoapService {
  private endpoint = 'https://authentication-rest-cert.aamva.org/Authentication/authenticate';
  private soapAction = 'Authenticate';

  constructor(private http: HttpClient) {}

  sendSoapRequest(): Observable<any> {
    // SOAP request body
    const soapEnvelope = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:auth="https://authentication-rest-cert.aamva.org/">
        <soapenv:Header>
          <!-- Optional: Include WS-Security headers if required -->
        </soapenv:Header>
        <soapenv:Body>
          <auth:Authenticate />
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    // HTTP headers for the SOAP request
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml',
      SOAPAction: this.soapAction,
    });

    // Make the HTTP POST request
    // return this.http.post(this.endpoint, soapEnvelope, {
    //   headers,
    //   responseType: 'text', // SOAP responses are XML
    // });


    let x = this.http.post(this.endpoint, soapEnvelope, {
      headers,
      responseType: 'text', // SOAP responses are XML
    });
     
     console.log("resp x-",x);

     return x;


  }
}
