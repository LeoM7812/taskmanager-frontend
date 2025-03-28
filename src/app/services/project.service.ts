import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../project.model';
import { Task } from '../task.model';

const BASE_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  projects: Project[] = [];

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${BASE_URL}/projects`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${BASE_URL}/projects/${id}`);
  }

  getTasksByProjectId(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${BASE_URL}/projects/${id}/tasks`);
  }

  createProject(project: Project): Observable<Project> {
    const { id, ...projectWithoutId } = project;
    return this.http.post<Project>(`${BASE_URL}/projects`, projectWithoutId);
  }


  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${BASE_URL}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/projects/${id}`);
  }
}
