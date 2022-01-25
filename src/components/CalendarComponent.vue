<template>
  <div>
    <FullCalendar :options="calendarOptions" />

    <b-modal v-model="modalShow" id="modal-1" title="BootstrapVue">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <form @submit.prevent>
              <div class="form-group">
                <label for="event_name">Event Name</label>
                <input
                  type="text"
                  id="event_name"
                  class="form-control"
                  v-model="newEvent.title"
                  maxlength="200"
                />
              </div>
              <div class="form-group">
                <label for="event_desc">Event Description</label>
                <input
                  type="text"
                  id="event_desc"
                  class="form-control"
                  v-model="newEvent.desc"
                  maxlength="500"
                />
              </div>
              <div class="form-group">
                <label for="end_date">End date</label>
                <input
                  type="date"
                  id="end_date"
                  class="form-control"
                  v-model="newEvent.end"
                />
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="start_time">Start time </label>
                    <input
                      placeholder="T14:00:00+00:00"
                      type="time"
                      id="start_time"
                      class="form-control"
                      v-model="newEvent.timestart"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="end_time">End time</label>
                    <input
                      placeholder="T14:00:00+00:00"
                      type="time"
                      id="end_time"
                      class="form-control"
                      v-model="newEvent.timeend"
                    />
                  </div>
                </div>
                <div class="col-md-6 mb-4">
                  <br />
                  <button class="btn btn-sm btn-primary" @click="addNewEvent">
                    Save Event
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { db } from "../FirebaseConfig";
import { BPopover } from "bootstrap-vue";

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      modalShow: false,
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          dayGridPlugin,
          interactionPlugin,
        ],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth, dayGridWeek, dayGridDay, listDay",
        },
        editable: true,
        selectable: true,
        weekend: true,
        eventMouseEnter: function (args) {
          let desc = args.event._def.extendedProps.desc;
          if (desc === undefined) {
            desc = "The is no description for this event.";
          }

          new BPopover({
            propsData: {
              content: "Event description: " + desc,
              placement: "auto",
              boundary: "scrollParent",
              boundaryPadding: 5,
              triggers: "hover",
              html: true,
              target: args.el,
            },
          }).$mount();
        },
        events: [],
        select: (arg) => {
          this.modalShow = true;
          (this.newEvent.start = arg.startStr),
            (this.newEvent.end = arg.startStr);
        },
        async eventClick(view) {
          const id = view.event._def.publicId;
          alert(
            "You are about to delete it this event! but you can always add a new one. Please refresh to see the changes."
          );
          await db.collection("calEvents").doc(id).delete();
        },
      },
      eventsBeforeModification: [],
      newEvent: {
        title: "",
        start: "",
        end: "",
        timestart: "",
        timeend: "",
        desc: "",
      },
    };
  },
  mounted() {
    this.getEvents();
  },
  methods: {
    async getEvents() {
      let snapshot = await db.collection("calEvents").get();
      let events = [];
      snapshot.forEach((doc) => {
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      });
      this.calendarOptions.events = events;
    },
    async addNewEvent() {
      let startDateAndTime = "";
      let endDateWithTime = "";
      if (this.newEvent.timestart !== "") {
        startDateAndTime =
          this.newEvent.start + "T" + this.newEvent.timestart + ":00+00:00";
      } else {
        startDateAndTime = this.newEvent.start;
      }
      if (this.newEvent.timeend !== "") {
        endDateWithTime =
          this.newEvent.end + "T" + this.newEvent.timeend + ":00+00:00";
      } else {
        endDateWithTime = this.newEvent.end;
      }
      await db.collection("calEvents").add({
        title: this.newEvent.title,
        start: startDateAndTime,
        end: endDateWithTime,
        timestart: this.newEvent.timestart,
        timeend: this.newEvent.timeend,
        desc: this.newEvent.desc,
      });
      this.getEvents();
      this.resetForm();
      this.modalShow = false;
    },

    resetForm() {
      Object.keys(this.newEvent).forEach((key) => {
        return (this.newEvent[key] = "");
      });
    },
  },
};

//
</script>

<style>
.fc .fc-col-header-cell-cushion {
  text-decoration: none;
}
.fc .fc-daygrid-day-number {
  text-decoration: none;
}
.fc-daygrid-day-frame.fc-scrollgrid-sync-inner {
  cursor: pointer;
}
.modal-header {
  justify-content: right !important;
}
.modal-title {
  display: none;
}
.modal-footer {
  display: none !important;
}
button.close {
  color: #808080;
  background: white;
  border-radius: 3px;
}
</style>
