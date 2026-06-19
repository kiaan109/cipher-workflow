import { TrashHeader, TrashList } from "@/features/workflows/components/workflows";
import { EntityContainer } from "@/components/entity-components";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();

  return (
    <EntityContainer header={<TrashHeader />}>
      <TrashList />
    </EntityContainer>
  );
};

export default Page;
