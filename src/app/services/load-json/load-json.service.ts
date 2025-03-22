import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeatureCard } from './tool.modelo';

@Injectable({
  providedIn: 'root'
})
export class LoadJsonService {

  constructor(private http: HttpClient) {}

  getFactureCards(): Observable<{ factureCards: FeatureCard[] }> {
    return this.http.get<{ factureCards: FeatureCard[] }>('assets/json/list-tols.json');
  }
}
