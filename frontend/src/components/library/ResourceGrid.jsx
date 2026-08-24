import ResourceCard from "./ResourceCard";
import { Pagination } from "../common";

export default function ResourceGrid({
resources = [],
savedIds = [],
savingId = null,
onSave,
page = 1,
setPage,
totalPages = 1,
}) {
const handlePageChange = (nextPage) => {
if (
nextPage < 1 ||
nextPage > totalPages ||
nextPage === page
) {
return;
}

setPage(nextPage);

// Keep the user at the beginning of the resource section
window.requestAnimationFrame(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

};

if (!resources.length) {
return ( <div className="py-16 text-center"> <p className="text-sm text-slate-400">
No resources found. 
</p>

    {totalPages > 1 && (
      <div className="mt-8 flex justify-center">
        <Pagination
          page={page}
          setPage={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    )}
  </div>
);

}

return ( 
  <div> 
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
      {resources.map((resource, index) => {
      const resourceId =
      resource.resourceId ||
      resource._id ||
      resource.id ||
      resource.link ||
      `${resource.title}-${index}`;

      return (
        <ResourceCard
          key={resourceId}
          resource={{
            ...resource,
            resourceId,
          }}
          isSaved={savedIds.includes(resourceId)}
          saving={savingId === resourceId}
          onSave={onSave}
        />
      );
    })}
  </div>
</div>
);
}
