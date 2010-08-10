Role('KiokuJS.Test.Person.Hobby', {
    
    requires : [ 'setMood' ],
    
    
    has : {
        hobbyName       : null
    },
    
    
    methods : {
        
        doHobby : function () {
            this.setMood('good')
        }
    }
})
