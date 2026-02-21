// Copyright © Todd Agriscience, Inc. All rights reserved.

import { WidgetEnum } from '@/lib/types/db';

/** Default values for each type of widget. `h` and `w` are height and width in # of columns, respectively. */
export const widgetSizing: Record<WidgetEnum, { h: number; w: number }> = {
  'Macro Radar': { h: 8, w: 3 },
  'Calcium Widget': { h: 5, w: 5 },
  'PH Widget': { h: 5, w: 5 },
  'Salinity Widget': { h: 5, w: 5 },
  'Magnesium Widget': { h: 5, w: 5 },
  'Sodium Widget': { h: 5, w: 5 },
  'Nitrate Nitrogen Widget': { h: 5, w: 5 },
  'Phosphate Phosphorus Widget': { h: 5, w: 5 },
  'Potassium Widget': { h: 5, w: 5 },
  'Zinc Widget': { h: 5, w: 5 },
  'Iron Widget': { h: 5, w: 5 },
  'Organic Matter Widget': { h: 5, w: 5 },
  'IMP Summaries': { h: 19, w: 2.5 },
};

/** The number of columns on a management zone tab. Fed to the `gridConfig` parameter of `ReactGridLayout` */
export const widgetColumns = 12;

/** The height of rows, in px, of the widgets. Fed to the `gridConfig` parameter of `ReactGridLayout` */
export const widgetRowHeight = 30;
