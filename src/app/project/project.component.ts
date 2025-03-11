import { Component } from '@angular/core';
import { ProjectTitleComponent } from './project-title/project-title.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TaskListComponent } from './task-list/task-list.component';
@Component({
  selector: 'app-project',
  imports: [ProjectTitleComponent, ProgressBarComponent, TaskListComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

}
