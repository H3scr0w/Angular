import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Zone, ZoneFilter, ZoneService } from '@shared';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ZoneValidator {
  static validateZoneIdNotTaken(zoneService: ZoneService, id: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let zones: Zone[] = [];
        const zoneFilter: ZoneFilter = new ZoneFilter();
        zoneFilter.id = c.value.trim();
        return zoneService.getAllZones('', 0, 10, '', '', 'asc', zoneFilter).pipe(
          map(res => {
            if (res.content) {
              zones = res.content;
              if (id) {
                zones = res.content.filter(zone => {
                  return zone.id !== id;
                });
              }
              return zones.filter(zone => zone.id.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { zoneIdNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }

  static validateZoneNameNotTaken(zoneService: ZoneService, name: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let zones: Zone[] = [];
        const zoneFilter: ZoneFilter = new ZoneFilter();
        zoneFilter.name = c.value.trim();
        return zoneService.getAllZones('', 0, 10, '', '', 'asc', zoneFilter).pipe(
          map(res => {
            if (res.content) {
              zones = res.content;
              if (name) {
                zones = res.content.filter(zone => {
                  return zone.name !== name;
                });
              }
              return zones.filter(zone => zone.name.toLowerCase() === c.value.toLowerCase()).length === 0
                ? null
                : { zoneNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
