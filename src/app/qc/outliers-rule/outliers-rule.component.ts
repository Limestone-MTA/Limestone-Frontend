import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Qc } from 'src/app/main/entities';

@Component({
  selector: 'app-outliers-rule',
  templateUrl: './outliers-rule.component.html',
  styleUrls: ['./outliers-rule.component.css']
})
export class OutliersRuleComponent {
  @Input() qc: Qc;
  @Input() readonly: any;
  @Output() calculate = new EventEmitter<any>();

  // To ensure ngModel returns a string so you need to parse it to int
  distanceMeanOnSliderChange(event: EventTarget) {
    const inputElement = event as HTMLInputElement;
    // Convert the string value to a number
    this.qc.distanceMean = parseInt(inputElement.value);
    this.calculate.emit();
  }

  distanceMeanOnInputChange(event: EventTarget) {
      const inputElement = event as HTMLInputElement;
      // Convert the string value to a number
      this.qc.distanceMean = parseInt(inputElement.value);
      this.calculate.emit();
  }
}
