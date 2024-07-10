import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Qc, Variable } from '../../main/entities';

@Component({
  selector: 'app-missing-rule',
  templateUrl: './missing-rule.component.html',
  styleUrls: ['./missing-rule.component.css'],
})
export class MissingRuleComponent implements OnInit {
  private variablesLength: number;
  @Input() project: { sampleSize: number; };
  @Input() qc: Qc;
  @Input() readonly: any;
  @Input() disableMissingRule: boolean; 
  @Output() calculate = new EventEmitter<any>();

  @Input() set variables(vars: Variable[]) {
    if (vars) {
      vars.sort((a, b) => b.missing - a.missing);
      this.multi = [{ name: 'Variables', series: [] }, { name: 'Limit', series: [] }];
      const modulo = Math.floor(vars.length / 100);
      vars.map((v, i) => {
        if (!(i % modulo)) {
          this.multi[0].series.push({ name: i, value: v.missing });
        }
      });
      this.variablesLength = vars.length;
      this.drawThreshold();
    }
  }
  perc = 0; // percentage
  multi: any[];
  showDetails = true;
  tooltipDisabled = true;

  constructor() {}

  ngOnInit() {
    this.drawThreshold();
  }

  private drawThreshold() {
    this.perc = Math.round((this.qc.missingThreshold * 1000) / this.project.sampleSize) / 10;
    if (this.variablesLength) {
      this.multi[1].series = [];
      this.multi[1].series.push({ name: 0, value: this.qc.missingThreshold });
      this.multi[1].series.push({ name: this.variablesLength, value: this.qc.missingThreshold });
      this.multi = [...this.multi];
    }
  }
  // To ensure ngModel returns a string so you need to parse it to int
  missingValuesOnSliderChange(event: EventTarget) {
    const inputElement = event as HTMLInputElement;
    // Convert the string value to a number
    this.qc.missingThreshold = parseInt(inputElement.value);
    this.calculate.emit();
  }

  missingValuesOnInputChange(event: EventTarget) {
      const inputElement = event as HTMLInputElement;
      // Convert the string value to a number
      this.qc.missingThreshold = parseInt(inputElement.value);
      this.calculate.emit();
  }
}
