import { Component, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { AttributeBarComponent } from '@app/components/attribute-bar/attribute-bar.component';
import { ToolsManagerService } from '@app/services/tools-manager/tools-manager.service';


@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent  {
    displayValue: string = 'none';
    @ViewChild('attributeBar') bar: AttributeBarComponent;
    lastColors: string[] = new Array<string>();
    currentTool: Tool = this.tools.currentTool;
    constructor(private tools: ToolsManagerService) {}

}

