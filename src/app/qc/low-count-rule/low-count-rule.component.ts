import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Qc } from '../../main/entities';

@Component({
  selector: 'app-low-count-rule',
  templateUrl: './low-count-rule.component.html',
  styleUrls: ['./low-count-rule.component.css']
})

export class LowCountRuleComponent {
  @Input() qc: Qc;
  @Input() readonly: any;
  @Output() calculate = new EventEmitter<any>();

  // To ensure ngModel returns a string so you need to parse it to int
  lowCountRuleOnSliderChange(event: EventTarget) {
    const inputElement = event as HTMLInputElement;
    // Convert the string value to a number
    this.qc.lowCountRule = parseInt(inputElement.value);
    this.calculate.emit();
  }

  lowCountRuleOnInputChange(event: EventTarget) {
      const inputElement = event as HTMLInputElement;
      // Convert the string value to a number
      this.qc.lowCountRule = parseInt(inputElement.value);
      this.calculate.emit();
  }

}
