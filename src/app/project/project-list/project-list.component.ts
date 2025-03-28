import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../task-list/task-list.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../project.model';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { Observable, of } from 'rxjs';

const emptyProject = {
  id: 0,
  name: '',
  description: '',
  budget: 0,
  user: { id: 0, firstname: '', lastname: '', email: '', password: '', role: '' },
  tasks: [],
};
@Component({
  selector: 'app-project-list',
  imports: [CommonModule, TaskListComponent,ProjectFormComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
  
})
export class ProjectListComponent implements OnInit {
   projects$: Observable<Project[]> | undefined;
   role$: Observable<string> | undefined;
   isAdmin:boolean = false;
    userEmail$: Observable<string> = of(this.readLocalStorageValue('EMAIL'));
    showModal: boolean = false;
    formType: 'CREATE' | 'UPDATE' = 'CREATE';
    selectedProject: Project = emptyProject;
    
    ngOnInit() {
      this.role$ = of(this.readLocalStorageValue('USER_ROLE'));
      this.role$?.subscribe(role =>{
        if(role === 'ADMIN'){
          this.isAdmin = true;
          console.log('Role:', role)}});

      this.userEmail$ = of(this.readLocalStorageValue('EMAIL'));
      if(this.isAdmin){
        this.projects$ = this.projectService.getProjects();
      }
      else{
        this.userEmail$.subscribe(email => {
        this.projectService.getProjectsWithTasksByUserEmail(email).subscribe((projects: Project[]) => {
            this.projects$ = of(projects);
            this.projects$ = of(projects.filter(project => project.tasks && project.tasks.length > 0));
          });
        });
      }
      
    }
    

    ngOnChanges() {
      console.log('Changes detected in ProjectListComponent');
      this.role$ = of(this.readLocalStorageValue('USER_ROLE'));
      this.updateProjects();
    }
  updateProject(project: Project) {
    this.showModal = true;
    this.formType = 'UPDATE';
    this.selectedProject = project;
    console.log('Updating project:', project);
  }

  deleteProject(projectId: number) {
    console.log('Deleting project with ID:', projectId);
    this.projectService.deleteProject(projectId).subscribe(() => {
      console.log(`Project with ID ${projectId} deleted`);
      this.updateProjects();
    });
  }
    constructor(private projectService: ProjectService) {}

    addNewProject() {
      this.showModal = true;
      this.formType = 'CREATE';
      this.selectedProject = { ...emptyProject };
      console.log('Adding new project');
    }
    readLocalStorageValue(key: string): string {
      return localStorage.getItem(key) || '';
    }
    updateProjects() {
      this.projectService.getProjects().subscribe((projects: Project[]) => {
      console.log('Projects:', this.projects$);
      this.projects$ = of(projects);
      });
    }
    getTasksForProject(projectId: number) {
      this.projectService.getTasksByProjectId(projectId).subscribe((tasks) => {
      console.log(`Tasks for project ${projectId}:`, tasks);
      });
    }

    handleModalClose() {
      this.showModal = false;
      this.updateProjects();
    }

}
