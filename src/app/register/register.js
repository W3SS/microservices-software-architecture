import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import template from './register.html';
import './register.css';


class UserRegistration {
    constructor(apiService) {
        this.tempRooms = {};
        this.currentRoomName = '';
        this.currentSeats = '';
        this.currentLocation = '';
        this.conferenceName = '';
        this.date = null;
        this.time = null;
        this.room = null;

        this.$onInit = function() {
            /*this.rooms.forEach(room => {
                this.tempRooms[room.conferenceRoomName] = {
                    location: room.location,
                    maxSeats: room.maxSeats,
                    roomId: room.roomId,
                    id: room.id
                }
            });

            this.rooms = this.rooms
                .map(room => { return room.conferenceRoomName })
                .map(state => { return { abbrev: state} });*/
        };

        this.onValueChanged = () => {
            let room = this.tempRooms[this.currentRoomName];

            if (room) {
                this.currentSeats = room.maxSeats;
                this.currentLocation = room.location;
            }
        };

        this.registerConference = () => {
            this.room = this.tempRooms[this.currentRoomName];
            let conference = {
                id: '',
                conferenceId: this.conferenceId,
                reservedRoomId: this.room.roomId,
                conferenceDate: new Date(this.getCombinedDateAnTime()).getTime(),
                conferenceName: this.conferenceName
            };

            /*apiService.registerConference(conference);
            apiService.reserveRoom(this.room.id);*/
        };

        this.getCombinedDateAnTime = () => {
            let time = this.time.toString().substring("Sat Dec 31 2016".length + 1, "Sat Dec 31 2016".length + 9);
            return this.date.toString().replace("00:00:00", time);
        }
    }
}

const moduleName = "userRegister";
const registerModule = angular.module(moduleName, [uiRouter]).config(["$stateProvider", function ($stateProvider) {
    $stateProvider.state({
        name: 'register',
        url: '/register',
        component: 'registerComponent'
    });
}]);

registerModule.component("registerComponent", {
    template,
    bindings: {
        rooms: "<"
    },
    controller: UserRegistration
});

export default moduleName;
