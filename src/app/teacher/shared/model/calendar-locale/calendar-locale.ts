import { LocaleSettings } from 'primeng/primeng';

export class CalendarLocale implements LocaleSettings {
    firstDayOfWeek?: number;
    dayNames: string[];
    dayNamesShort: string[];
    dayNamesMin: string[];
    monthNames: string[];
    monthNamesShort: string[];
}
