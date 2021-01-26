import { Component } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'PolyDessin2';
    message: BehaviorSubject<string>;
    drawingData: string | null;

    constructor(private drawingService: DrawingService) {
        this.message = new BehaviorSubject<string>('');
        this.drawingData = localStorage.getItem('drawing');
    }
    continueDrawing(): void {
        this.drawingService.getAfterViewObservable().subscribe(() => {
        });
    }

    newDrawing(): void {
        this.drawingService.getAfterViewObservable().subscribe(() => {
            localStorage.setItem('drawing', this.drawingService.canvas.toDataURL());
        });
    }
}
