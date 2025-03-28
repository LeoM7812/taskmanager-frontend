import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../task.model';
import { TaskService } from '../../services/task.service';
import { ProjectListComponent } from '../project-list/project-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  
  @Input() currentTask: Task | null = null;
  @Input() formType: 'UPDATE' | 'CREATE' | 'ASSIGN' = 'CREATE';
  @Output() closePanel = new EventEmitter<'SUBMIT' | 'CANCEL'>();
  @Output() taskUpdated = new EventEmitter<void>();
  taskForm: FormGroup;

  private taskService = inject(TaskService);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      userEmail: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentTask'] && changes['currentTask'].currentValue) {
      const task = changes['currentTask'].currentValue as Task;

      const dueDateFormatted = task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '';

      this.taskForm.patchValue({
        ...task,
        dueDate: dueDateFormatted,
      });
    }
  }

  handleSubmit() {
    if (this.formType === 'ASSIGN') {
      const taskId = this.currentTask?.id || 0;
      const userEmail = this.taskForm.value.userEmail;

      if (userEmail) {
        this.taskService.getUserByEmail(userEmail).subscribe((user) => {
          if (user) {
        const userId = user.id;
        this.taskService.assignUserToTask(taskId, userId).subscribe({
          next: (updatedTask) => {
            console.log(`Task with ID ${taskId} successfully assigned to user with ID ${userId}`);
            this.taskUpdated.emit();
            this.closePanel.emit('SUBMIT');
          },
          error: (error) => console.error('Error assigning user to task:', error),
        });
          } else {
        console.error(`User with email ${userEmail} not found`);
          }
        });
      }
      return;
    }
    if (this.taskForm.valid && (this.formType === 'CREATE' || this.formType === 'UPDATE')) {
      const newTask: Task = {
        ...this.taskForm.value,
        dueDate: new Date(this.taskForm.value.dueDate),
        completed: this.formType === 'UPDATE' ? this.taskForm.value.completed : false,
        project: this.currentTask?.project || null,
      };
      console.log(this.currentTask?.project.id);
      console.log('New task:', newTask.project.id);
      if (this.formType === 'CREATE') {0
        this.taskService.addTask(newTask).subscribe({
          next: (response) => {
            console.log('Task created successfully:', response);
            this.taskUpdated.emit(); // Emit event
            this.closePanel.emit('SUBMIT');
          },
          error: (error) => console.error('Error creating task:', error),
        });
      } else {
        newTask.id = this.currentTask?.id || 0;
        this.taskService.updateTask(newTask).subscribe({
          next: (response) => {
            console.log('Task updated successfully:', response);
            this.taskUpdated.emit(); // Emit event
            this.closePanel.emit('SUBMIT');
          },
          error: (error) => console.error('Error updating task:', error),
        });
      }
    }
  }

  handleCancel() {
    this.closePanel.emit('CANCEL');
  }
}
