import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Const } from '@app/classes/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolsManagerService } from '@app/services/tools-manager/tools-manager.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnChanges {
    subscription: Subscription;
    currentToolName: string;
    @Input() primaryColor: string = this.tools.currentTool.primaryColor.slice(0, Const.COLOR_STRING_LENGTH);
    @Input() secondaryColor: string = this.tools.currentTool.secondaryColor.slice(0, Const.COLOR_STRING_LENGTH);
    isRevertClicked: boolean;
    attributeBarIsActive: boolean;

    constructor(
        private tools: ToolsManagerService,
        protected drawingService: DrawingService,
        protected invoker: UndoRedoService,
    ) {
        this.isRevertClicked = false;
        this.attributeBarIsActive = false;
    }

    @ViewChild('icons', { static: false }) toolIcons: ElementRef<HTMLCanvasElement>;
    ngOnChanges(): void {
        this.subscription = this.drawingService.getMessage().subscribe((message: string) => {
            const numberOfTools = this.toolIcons.nativeElement.getElementsByTagName('a').length;
            for (let i = 0; i < numberOfTools; i++) {
                this.toolIcons.nativeElement.getElementsByTagName('a')[i].classList.remove('active');
            }
            this.toolIcons.nativeElement.querySelector('#' + message)?.setAttribute('class', 'active');
        });

        if (!this.isRevertClicked) {
            const primColorDiv = document.querySelector('.color-box1') as HTMLElement;
            const secondColorDiv = document.querySelector('.color-box2') as HTMLElement;
            primColorDiv.style.backgroundColor = this.primaryColor;
            secondColorDiv.style.backgroundColor = this.secondaryColor;
        }
        this.isRevertClicked = false;
    }

    undo(): void {
        this.invoker.undoLast();
    }

    redo(): void {
        this.invoker.redoPrev();
    }

    undoRedoAllowed(): boolean {
        return this.invoker.getIsAllowed();
    }


    displayPalette(toolName: string): void {
        if (!this.attributeBarIsActive) {
            this.attributeBarIsActive = true;
            this.togglecanvas('drawing-container-open');
            this.toggleAttributeBar('attribute-open');
        } else if (this.tools.getTools().get(toolName) === this.tools.currentTool) {
            this.attributeBarIsActive = false;
            this.togglecanvas('drawing-container');
            this.toggleAttributeBar('attribute-close');
        }
    }

    toggleAttributeBar(classname: string): void {
        document.querySelectorAll('#attribute').forEach((item) => {
            item.setAttribute('class', classname);
        });
    }

    toggleColorPalette(colorpickerId: string): void {
        if (colorpickerId === 'primaryColorPicker') {
            if (document.querySelector('#primaryColorPicker')?.getAttribute('style') === 'display:block')
                document.querySelector('#primaryColorPicker')?.setAttribute('style', 'display:none');
            else {
                document.querySelector('#primaryColorPicker')?.setAttribute('style', 'display:block');
                document.querySelector('#secondaryColorPicker')?.setAttribute('style', 'display:none');
            }
        } else {
            if (document.querySelector('#secondaryColorPicker')?.getAttribute('style') === 'display:block')
                document.querySelector('#secondaryColorPicker')?.setAttribute('style', 'display:none');
            else {
                document.querySelector('#secondaryColorPicker')?.setAttribute('style', 'display:block');
                document.querySelector('#primaryColorPicker')?.setAttribute('style', 'display:none');
            }
        }
    }

    togglecanvas(classname: string): void {
        document.getElementById('drawing-div')?.setAttribute('class', classname);
    }

    changeTools(name: string): void {
        this.drawingService.restoreCanvasState();
        this.tools.setTools(name);
        if (this.tools.currentTool instanceof GridService) {
            this.tools.currentTool.onKeyDown({ key: 'g' } as KeyboardEvent);
        }
        const numberOfTools = this.toolIcons.nativeElement.getElementsByTagName('a').length;
        for (let i = 0; i < numberOfTools; i++) {
            this.toolIcons.nativeElement.getElementsByTagName('a')[i].classList.remove('active');
        }
        this.toolIcons.nativeElement.querySelector('#' + name)?.setAttribute('class', 'active');
    }

    revertColors(): void {
        this.isRevertClicked = true;
        const primColorDiv = document.querySelector('.color-box1') as HTMLElement;
        const secondColorDiv = document.querySelector('.color-box2') as HTMLElement;
        const tmpPrimaryColor: string = this.tools.currentTool.primaryColor;
        const tmpSecondaryColor: string = this.tools.currentTool.secondaryColor;
        this.tools.currentTool.primaryColor = tmpSecondaryColor;
        this.tools.currentTool.secondaryColor = tmpPrimaryColor;
        primColorDiv.style.backgroundColor = this.tools.currentTool.primaryColor;
        secondColorDiv.style.backgroundColor = this.tools.currentTool.secondaryColor;
    }
    getInvoker(): UndoRedoService {
        return this.invoker;
    }
}
