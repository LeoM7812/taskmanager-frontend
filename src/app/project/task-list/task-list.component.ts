import { Component, inject, Input } from '@angular/core';
import { Task } from '../../task.model';
import { DatePipe, CommonModule } from '@angular/common';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

const emptyTask = {
  name: '',
  description: '',
  dueDate: new Date(),
  completed: false,
  project: { id: 0, name: '', description: '', tasks: [] },	
  id: 0,
  user: { id: 0, firstname: '', lastname: '', email: '', password: '', role: '' },
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, TaskFormComponent, CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() projectid: number = 0;
  showModal: boolean = false;
  role: string = '';
  userEmail: string = '';
  formType: 'CREATE' | 'UPDATE' = 'CREATE';
  selectedTask: Task = emptyTask;


constructor(private taskService: TaskService) {}
 
  ngOnInit() {
    this.role = this.readLocalStorageValue('USER_ROLE');
    this.userEmail = this.readLocalStorageValue('EMAIL');
    console.log(this.projectid);
  }
  refreshTasks() {
    const projectId = this.projectid;
    this.taskService.getTasksByProjectId(projectId).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }
  
  handleCheckboxChange(task: Task) {
    task.completed = !task.completed;
    this.taskService.updateTask(task).subscribe(() => {
      console.log(`Task with ID ${task.id} updated`);
    });
  }
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
  readLocalStorageValue(key: string): string {
    return localStorage.getItem(key) || '';
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      console.log(`Task with ID ${id} deleted`);
    })
    this.tasks = this.tasks.filter((task) => task.id !== id);

  }

  updateTask(task: Task) {
    this.selectedTask = task;
    this.selectedTask.project.id = this.projectid;
    this.formType = 'UPDATE';
    this.showModal = true;
  }

  addNewTask() {
    
    this.selectedTask = { ...emptyTask, project: { ...emptyTask.project, id: this.tasks[0]?.project?.id ?? 0 } };
    this.selectedTask.project.id = this.projectid;
    this.formType = 'CREATE';
    this.showModal = true;
  }

  handleModalClose(type: 'SUBMIT' | 'CANCEL') {
    this.showModal = false;
  }
}
