import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common'; // Додайте CommonModule
import { FormsModule } from '@angular/forms'; // Додайте FormsModule
import { DatePipe } from '@angular/common'; // Додайте DatePipe

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
  imports: [CommonModule, DatePipe, FormsModule] // Додайте в imports
})
export class UserProfileComponent implements OnInit {
  user: any;
  isEditing = false;
  newName = '';
  newEmail = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();  // Отримуємо userId
    if (userId) {
      this.dataService.getUserProfile(userId).subscribe(data => {
        this.user = data;
        this.newName = this.user.name;
        this.newEmail = this.user.email;
      });
    }
  }

  updateProfile(): void {
    const updatedUser = {
      name: this.newName,
      email: this.newEmail
    };

    this.dataService.updateUserProfile(updatedUser).subscribe(() => {
      this.user.name = this.newName;
      this.user.email = this.newEmail;
      this.isEditing = false;
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  editProfile(): void {
    this.isEditing = true;
  }
}
