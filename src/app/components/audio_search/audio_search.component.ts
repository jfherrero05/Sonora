import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-audio-search',
    templateUrl: './audio-search.component.html'
})
export class AudioSearchComponent {
    @Output() onSearch = new EventEmitter<string>();

    buscar(event: any) {
        const valor = event.target.value;
        this.onSearch.emit(valor); // Envía el texto al padre (audio-list)
    }
}