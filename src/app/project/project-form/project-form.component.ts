import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Project } from '../../project.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { ProjectService } from '../../services/project.service';
@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectFormComponent implements OnInit {
  @Input() currentProject: Project | null = null;
  @Input() formType: 'CREATE' | 'UPDATE' = 'CREATE';
  @Output() closePanel = new EventEmitter<'SUBMIT' | 'CANCEL'>();
  projectForm!: FormGroup;

   private projectService = inject(ProjectService);
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      id: [this.currentProject?.id],
      name: [this.currentProject?.name || '', Validators.required],
      description: [this.currentProject?.description || ''],
      budget: [this.currentProject?.budget || 0, [Validators.required, Validators.min(0)]],
    });
  }
  handleSubmit(): void {
    if (this.projectForm.valid) {
      const newProject: Project = {
        ...this.projectForm.value,
      };
  
      if (this.formType === 'CREATE') {
        console.log('Create new project:', newProject);
        this.projectService.createProject(newProject).subscribe({
          next: (response) => {
            console.log('Project created successfully:', response);
            this.closePanel.emit('SUBMIT');
          },
          error: (error) => console.error('Error creating project:', error)
        });
      } else {
        const updatedProject = { ...this.currentProject, ...newProject };
        console.log("Budget",updatedProject.budget);
        this.projectService.updateProject(this.currentProject?.id!, updatedProject).subscribe({
          next: (response) => {
            console.log('Project updated successfully:', response);
            this.closePanel.emit('SUBMIT');
          },
          error: (error) => console.error('Error updating project:', error)
        });
      }
    }
  }
  

  handleCancel(): void {
    console.log('Form canceled');
    this.projectForm.reset();
    this.closePanel.emit('CANCEL');
  }
}
