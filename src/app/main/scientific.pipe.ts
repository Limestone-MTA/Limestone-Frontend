import { Pipe, PipeTransform } from '@angular/core';
/*
 * Usage:
 *   value | scientific:exponent
 * Example:
 *   {{ 2 | scientific:10 }}
 *   formats to: ...
 */
@Pipe({ name: 'scientific' })
export class ScientificPipe implements PipeTransform {
  transform(value: number, exponent: number): string {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    const abs = Math.abs(value);
    if (abs < 0.01) {
      const exp = value.toExponential(exponent);
      return exp;
    }
    return (Math.trunc(value * 10000) / 10000).toString();
  }
}
