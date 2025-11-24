import { Component, OnInit } from '@angular/core';
import { SoundService } from '../service/sound.service';
import { Sound } from '../interfaces/sound.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listaSonidos: Sound[] = [];

  constructor(private soundService: SoundService) {}

  ngOnInit() {
    this.soundService.getAllSounds().subscribe((datos: Sound[]) => {
      this.listaSonidos = datos;
    });
  }
}