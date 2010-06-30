Class('KiokuJS.Test.Fixture', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        handle                  : null,
        
        t                       : { required : true },
        requiredBackendRoles    : null
    },
    
        
    methods : {
        
        precheck : function () {
        }
        
    },
    
    
    continued : {
        
        methods : {
            
            run : function () {
                var t = this.t
                
                this.precheck()
                
                this.populate().then(function () {
                    
                    
                    this.TRY(function () {
                        
                        this.verify().now()
                        
                    }).CATCH(function (e) {
                        
                        t.fail('Exception [' + e + '] caught during `verify` of fixture: [' + this.meta.name + ']')
                        
                        this.CONTINUE()
                    })
                    
                }).now()
            },
        
        
            populate : function () {
            },
            
            
            verify : function () {
            }
        }
    }

})

