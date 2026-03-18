// Copyright © Todd Agriscience, Inc. All rights reserved.

import z from 'zod';
import { userInfo } from '../zod-schemas/onboarding';

export type userInfoType = z.infer<typeof userInfo>;
