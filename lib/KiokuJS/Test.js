Class('KiokuJS.Test', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        t               : null,
        
        init            : null,
        
        fixtures        : [
            'ObjectGraph'
        ]
    },
    
        
    continued : {
        
        methods : {
            
            runAllFixtures : function () {
            }
        }
    }

})

