import { Injectable } from '@angular/core';
import { Task } from '../task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: Task[] = [
  ];
  constructor(private http: HttpClient) {}

  // getTasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${BASE_URL}/tasks`);
  }
  getTasksByProjectId(id: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${BASE_URL}/projects/${id}/tasks`);
  }
  // addTask
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${BASE_URL}/tasks`, { ...task });
  }
  // assignUserToTask
  assignUserToTask(taskId: number, userId: number): Observable<Task> {
    return this.http.post<Task>(`${BASE_URL}/tasks/${taskId}/assignUser/${userId}`, {});
  }
  // getUserByEmail
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL}/users/${email}`);
  }
  // updateTask
  updateTask(newTask: Task): Observable<Task> {
    console.log('newTask:', newTask);
    return this.http.put<Task>(`${BASE_URL}/tasks/${newTask.id}`, {
      ...newTask,
      project: null,
    });
  }

  // deleteTask
  deleteTask(id: number) {
    return this.http.delete(`${BASE_URL}/tasks/${id}`);
  }
}
