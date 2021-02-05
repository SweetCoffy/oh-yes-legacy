module.exports = {
    name: "adventure",
    description: 'ha ha yes bootleg bread adventures',
    requiredPermission: 'yes',
    async execute(message) {
        var points = 0;
        var roomCount = 2;
        var possibleRooms = [
            {
                name: 'Master Egg Shrine',
                id: 'egg-shrine',
                tasks: [
                    {
                        name: "Hail Eggs",
                        points: 15,
                        done: false,
                        event: () => {}
                    }
                ]
            },
            {
                name: 'Egg Lab',
                id: 'egg-lab',
                eggCount: 2,
                tasks: []
            }
        ]
        var rooms = Object.create(possibleRooms)
        
    }
}