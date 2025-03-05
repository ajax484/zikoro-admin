"use client";

import { useGetAdminEvents } from "@/hooks";
import { EventLayout } from "./_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { Button } from "@/components";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { CalendarDateFill } from "styled-icons/bootstrap";
import { TimeFive } from "styled-icons/boxicons-solid";
import { LocationDot } from "styled-icons/fa-solid";
import { Users } from "styled-icons/fa-solid";
import { Dot } from "styled-icons/bootstrap";
import { Edit } from "styled-icons/boxicons-solid";
import { AboutWidget, EventLocationType } from "@/components/composables";
import { TOrgEvent } from "@/types";
import { PublishCard } from "@/components/composables";
import { PreviewModal } from "../../contents/_components/modal/PreviewModal";
import { useEffect, useMemo, useState } from "react";
import { useFormatEventData, usePublishEvent } from "@/hooks";
import { Download } from "styled-icons/bootstrap";
import { Eye } from "styled-icons/feather";
import { EmptyCard } from "../../composables";
import useUserStore from "@/store/globalUserStore";
import { ExternalLink } from "styled-icons/feather";
import Link from "next/link";
import { Pagination } from "@/components/custom_ui/Pagination";

export default function AdminEvents({
  searchParams: { e },
}: {
  searchParams: any;
}) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endStartDate, setEndStartDate] = useState<Date | null>(new Date());
  const [endEndDate, setEndEndDate] = useState<Date | null>(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(50);

  useEffect(() => {
    if (e !== null) {
      setFrom(0);
      setTo(50);
    }
  }, [e]);

  const {
    events: eventData,
    getEvents,
    isLoading: loading,
    hasReachedLastPage,
    total
  } = useGetAdminEvents({
    eventStatus: e,
    from,
    to,

  });

  console.log(eventData, startDate, endDate)

  // const { ref: infiniteScrollRef } = useInfiniteScrollPagination(
  //   hasReachedLastPage,
  //   setFrom,
  //   setTo,
  //   setInitialLoading
  // );

  async function refetch() {
    getEvents();
  }

  function initialToFalse() {
    setInitialLoading(false);
    setFrom(0);
    setTo(50);
  }

  const filteredEvents = useMemo(() => {
   if (startDate && !endDate) return eventData;
   if (endStartDate && !endEndDate) return eventData;
    return eventData?.filter((e) => {
      // Date range filter
      const isDateInRange =
        (!startDate || new Date(e.startDateTime) >= startDate) &&
        (!endDate || new Date(e.startDateTime) <= endDate);

      const isEndDateInRange =
        (!endStartDate || new Date(e.startDateTime) >= endStartDate) &&
        (!endEndDate || new Date(e.startDateTime) <= endEndDate);

      return isDateInRange && isEndDateInRange;
    });
  }, [startDate, endDate, eventData, endStartDate, endEndDate]);

  function changePage(n: number) {
    // 1 * 50 // 1 * 50 -50
    // 2 * 50 // 2 * 50 - 50
    // 3 & 50 // 3 * 50 -50
    // 4 & 50 //
   // console.log("number of page", n);
    setFrom(n * 50 - 50);
    setTo(n * 50);
  }
  return (
    <EventLayout
      query={e}
      startDate={startDate}
      endDate={endDate}
      setEndDate={setEndDate}
      setStartDate={setStartDate}
      endEndDate={endEndDate}
      endStartDate={endStartDate}
      setEndStartDate={setEndStartDate}
      setEndEndDate={setEndEndDate}
    >
      {loading && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
      {!loading &&
        Array.isArray(filteredEvents) &&
        filteredEvents?.length === 0 && <EmptyCard text={`No Event`} />}
      {!loading && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center w-full h-full xl:grid-cols-3">
          {Array.isArray(filteredEvents) &&
            filteredEvents?.map((event) => (
              <div
                // ref={!hasReachedLastPage ? infiniteScrollRef : null}
                className="w-full"
              >
                <EventCard
                  key={event?.id}
                  refetch={refetch}
                  initialToFalse={initialToFalse}
                  event={event as TOrgEvent}
                  query={e}
                />
              </div>
            ))}
        </div>
      )}

<Pagination totalPages={total} setPage={changePage} />
    </EventLayout>
  );
}

function EventCard({
  event,
  query,
  refetch,
  initialToFalse,
}: {
  refetch: () => Promise<any>;
  event: TOrgEvent;
  query: string | null;
  initialToFalse: () => void;
}) {
  const { isLoading: updating, publishEvent: update } = usePublishEvent();
  const { user: userData } = useUserStore();
  const [isShowPublishModal, setShowPublishModal] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isAction, setAction] = useState(false);
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    currency,
    removeComma,
    createdAt,
    price,
  } = useFormatEventData(event);

  function onClose() {
    setOpen((prev) => !prev);
  }

  async function publishEvent() {
    initialToFalse();
    const statusDetail = {
      createdAt: new Date().toISOString(),
      status: "published",
      user: userData?.userEmail,
    };

    const { organization, ...remainingData }: any = event;
    await update({
      payload: {
        ...remainingData,
        published: true,
        eventStatus: "published",
        eventStatusDetails:
          event?.eventStatusDetails && event?.eventStatusDetails !== null
            ? [...event?.eventStatusDetails, statusDetail]
            : [statusDetail],
      },
      eventId: String(event?.eventAlias),
      email: event?.organization?.eventContactEmail,
    });
    refetch();
    window.location.reload();
    showPublishModal();
  }

  function showPublishModal() {
    setShowPublishModal((prev) => !prev);
  }

  // get the publisher name
  const publisher: string | undefined = useMemo(() => {
    const publishedObj = event?.eventStatusDetails?.find(
      ({ status }) => status === "published"
    );
    return publishedObj?.user;
  }, [event]);
  return (
    <>
      <div
        role="button"
        //   onClick={goToEvent}
        className="border flex flex-col gap-y-6 bg-white rounded-lg p-3 sm:p-4  w-full"
      >
        <div className="w-full flex items-center justify-between">
          <p className="font-medium text-lg line-clamp-1">
            {event?.eventTitle ?? ""}
          </p>
          <div className="flex items-center gap-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                //  onClose();
              }}
              className="relative px-0 h-10 bg-transparent"
            >
              <ThreeDotsVertical size={20} />
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col text-[13px] gap-y-1 items-start justify-start">
          <AboutWidget
            Icon={CalendarDateFill}
            text={`${startDate} – ${endDate}`}
          />
          <AboutWidget Icon={TimeFive} text={`${startTime} - ${endTime}`} />
          <AboutWidget
            Icon={LocationDot}
            text={
              <p className="flex items-center ">
                {`${event?.eventCity ?? ""}`}
                {!removeComma && <span>,</span>}
                <span className="ml-1">{`${event?.eventCountry ?? ""}`}</span>
              </p>
            }
          />
          <AboutWidget
            Icon={Users}
            text={
              <p className="flex items-center ">
                <span>{`${event.expectedParticipants ?? 0} participants`}</span>

                {event?.registered !== null && <Dot size={22} />}
                {event?.registered !== null && (
                  <span className="text-xs font-medium  text-basePrimary">{`${
                    event?.registered.toLocaleString() ?? ""
                  } registered`}</span>
                )}
              </p>
            }
          />
        </div>

        <div className="flex items-center justify-between w-full">
          {Array.isArray(event?.pricing) && event?.pricing?.length > 0 ? (
            <p className="font-medium">{`${
              currency ? currency : "₦"
            }${price}`}</p>
          ) : (
            <p className="w-1 h-1"></p>
          )}

          <div className="flex items-center gap-x-2">
            <EventLocationType locationType={event.locationType} />
            <div className="flex text-xs text-gray-500 flex-col items-start justify-start">
              <p>
                {event.published ? (
                  "Published"
                ) : (
                  <button className="flex items-center gap-x-1">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                )}
              </p>
              <p>{createdAt}</p>
            </div>
          </div>
        </div>
        {(query === "review" || query === null) && (
          <div className="py-4 w-full border-t  p-4 flex items-center gap-x-2">
            <Button
              // type="submit"
              onClick={onClose}
              className="text-gray-50 bg-basePrimary gap-x-2"
            >
              <Eye size={22} />
              <p>Preview</p>
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                showPublishModal();
              }}
              type="submit"
              className="text-basePrimary border border-basePrimary gap-x-2"
            >
              <Download size={22} />
              <p>Publish</p>
            </Button>
          </div>
        )}
        {query === "published" && (
          <div className="py-4 w-full border-t   p-4 flex items-start justify-between ">
            <div>
              <p className="text-mobile sm:text-sm">Published By</p>
              <p className="text-gray-500 w-full text-mobile sm:text-sm ">{` ${
                publisher ?? ""
              }`}</p>
            </div>
            <Link href={`/live-events/${event?.eventAlias}`} target="_blank">
              <ExternalLink size={22} />
            </Link>
          </div>
        )}
      </div>
      {isShowPublishModal && (
        <PublishCard
          asyncPublish={publishEvent}
          close={showPublishModal}
          loading={updating}
          message={`Are you sure you want to publish this event?.`}
        />
      )}
      {isOpen && (
        <PreviewModal
          close={onClose}
          type="Preview"
          title={event?.eventTitle}
          url={`/preview/${event?.eventAlias}`}
        />
      )}
    </>
  );
}

//  function AdminEvents() {
// return (
//   <Suspense>
//     <AdminEventsComp />
//   </Suspense>
// )
// }
