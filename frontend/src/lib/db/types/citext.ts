// Copyright © Todd Agriscience, Inc. All rights reserved.

import { customType } from 'drizzle-orm/pg-core';

export default customType<{ data: string }>({
  dataType() {
    return 'citext';
  },
});
