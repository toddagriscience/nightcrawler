// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-user-farm-id';
import GeneralBusinessInformation from './components/general-business-information';
import Colleagues from './components/colleagues';
import { db } from '@/lib/db/schema/connection';
import {
  farm,
  farmCertificate,
  farmInfoInternalApplication,
  farmLocation,
  user,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Farm from './components/farm';

/** The apply page
 *
 * @returns {JSX.Element} - The application page*/
export default async function Apply() {
  const currentUser = await getAuthenticatedInfo();

  if ('error' in currentUser) {
    return <div></div>;
  }

  const farmId = currentUser.farmId!;
  const [farmInfo] = await db
    .select()
    .from(farm)
    .where(eq(farm.id, farmId))
    .fullJoin(farmLocation, eq(farmLocation.farmId, farmId))
    .fullJoin(farmCertificate, eq(farmCertificate.farmId, farmId))
    .limit(1);

  const allUsers = await db.select().from(user).where(eq(user.farmId, farmId));
  const [internalApplication] = await db
    .select()
    .from(farmInfoInternalApplication)
    .where(eq(farmInfoInternalApplication.farmId, farmId))
    .limit(1);

  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            General Business Information
          </TabsTrigger>
          <TabsTrigger value="colleagues">Colleagues</TabsTrigger>
          <TabsTrigger value="farm">Farm Information</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralBusinessInformation
            currentUser={currentUser}
            defaultValues={{
              ...farmInfo.farm,
              ...farmInfo.farm_location,
              ...farmInfo.farm_certificate,
            }}
          />
        </TabsContent>

        <TabsContent value="colleagues">
          <Colleagues allUsers={allUsers} />
        </TabsContent>

        <TabsContent value="farm">
          <Farm defaultValues={{ ...internalApplication, farmId }} />
        </TabsContent>

        <TabsContent value="terms">{/* Terms content */}</TabsContent>
      </Tabs>
    </div>
  );
}
