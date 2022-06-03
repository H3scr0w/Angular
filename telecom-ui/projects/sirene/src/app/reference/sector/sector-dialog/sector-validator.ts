import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Sector, SectorFilter, SectorService } from '@shared';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SectorValidator {
  static validateSectorIdNotTaken(sectorService: SectorService, id: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let sector: Sector[] = [];
        const sectorFilter: SectorFilter = new SectorFilter();
        sectorFilter.id = c.value.trim();
        return sectorService.getAllSectors('', 0, 10, '', 'asc', sectorFilter).pipe(
          map(res => {
            if (res.content) {
              sector = res.content;
              if (id) {
                sector = res.content.filter(sec => {
                  return sec.id !== id;
                });
              }
              return sector.filter(sec => sec.id.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { sectorIdNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }

  static validateSectorNameNotTaken(sectorService: SectorService, name: string): AsyncValidatorFn {
    return (c: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (c.value) {
        let sector: Sector[] = [];
        const sectorFilter: SectorFilter = new SectorFilter();
        sectorFilter.name = c.value.trim();
        return sectorService.getAllSectors('', 0, 10, '', 'asc', sectorFilter).pipe(
          map(res => {
            if (res.content) {
              sector = res.content;
              if (name) {
                sector = res.content.filter(sec => {
                  return sec.name !== name;
                });
              }
              return sector.filter(sec => sec.name.toLowerCase().trim() === c.value.toLowerCase().trim()).length === 0
                ? null
                : { sectorNameNotTaken: true };
            }
          })
        );
      }
      return of(null);
    };
  }
}
