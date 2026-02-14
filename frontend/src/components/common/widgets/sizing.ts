// Copyright © Todd Agriscience, Inc. All rights reserved.

import { WidgetEnum } from '@/lib/types/db';

/** Default values for each type of widget. `h` and `w` are height and width in # of columns, respectively. */
export const widgetSizing: Record<WidgetEnum, { h: number; w: number }> = {
  'Macro Radar': { h: 6, w: 3 },
  'Calcium Widget': { h: 2, w: 8 },
};

/** The number of columns on a management zone tab. Fed to the `gridConfig` parameter of `ReactGridLayout` */
export const widgetColumns = 12;

/** The height of rows, in px, of the widgets. Fed to the `gridConfig` parameter of `ReactGridLayout` */
export const widgetRowHeight = 60;
