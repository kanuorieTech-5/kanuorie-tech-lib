import ResourceCard from "./ResourceCard";
import { Pagination } from "../common";


export default function ResourceGrid({
  resources,
  savedIds,
  savingId,
  onSave,
  page,
  setPage,
  totalPages,
}) {

  if (!resources.length) {
    return (
      <div className="py-20 text-center text-gray-500">
        No resources found.
      </div>
    );
  }


  return (
    <div>

      <div className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      ">

        {resources.map((resource) => (

          <ResourceCard
            key={
              resource.link ||
              resource.resourceId ||
              resource._id ||
              resource.id
            }
            resource={resource}
            isSaved={savedIds.includes(
              resource.resourceId
            )}
            savingId={savingId}
            onSave={onSave}
          />

        ))}

      </div>


      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">

          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />

        </div>
      )}

    </div>
  );
}