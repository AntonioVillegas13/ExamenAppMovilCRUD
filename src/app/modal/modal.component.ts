import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AvatarService, Registro } from '../services/avatar.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() id: string;
  registro: Registro= null;

  constructor(private avatarservice: AvatarService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.avatarservice.getNoteById(this.id).subscribe(res => {
      this.registro = res;
      console.log(res)
    });
  }

  async deleteNote() {
    await this.avatarservice.deleteNote(this.registro)
    this.modalCtrl.dismiss();
  }

  async updateNote() {
    await this.avatarservice.updateNote(this.registro);
    const toast = await this.toastCtrl.create({
      message: 'Note updated!.',
      duration: 2000
    });
    toast.present();

  }

}

