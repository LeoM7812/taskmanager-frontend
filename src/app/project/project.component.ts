import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ProjectTitleComponent } from './project-title/project-title.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ProjectListComponent } from './project-list/project-list.component';
@Component({
  selector: 'app-project',
  imports: [ProjectTitleComponent, ProjectListComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectComponent {
}
