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

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  
  @Input() currentTask: Task | null = null;
  @Input() formType: 'UPDATE' | 'CREATE' = 'CREATE';
  @Output() closePanel = new EventEmitter<'SUBMIT' | 'CANCEL'>();
  @Output() taskUpdated = new EventEmitter<void>();
  taskForm: FormGroup;

  private taskService = inject(TaskService);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
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
    
    if (this.taskForm.valid) {
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
