import { User } from './user.model';
import { Project } from './project.model';
export interface Task {
    id: number;
    name: string;
    description: string;
    completed: boolean;
    dueDate: Date;
    project:Project;
    user: User;
}
