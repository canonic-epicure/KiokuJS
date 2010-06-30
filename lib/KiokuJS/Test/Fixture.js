Class('KiokuJS.Test.Fixture', {
    
    use     : 'KiokuJS.Backend.Role.SkipFixture',
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        init                    : { required : true },
        
        t                       : { required : true },
        requiredBackendRoles    : Joose.I.Array,
        
        sort                    : 1
    },
    
        
    methods : {
        
        checkSkip : function (handle) {
            
            var backend = handle.backend
            
            if (backend.meta.does(KiokuJS.Backend.Role.SkipFixture)) {
                var shouldSkip = backend.skipFixtures()
                
                if (Joose.A.exists(shouldSkip, this.meta.name)) return true
            }
            
            return !Joose.A.each(this.requiredBackendRoles, function (requiredRole) {
                requiredRole = eval(requiredRole)
                
                if (typeof requiredRole != 'function' || !requiredRole.meta) throw "Unknown value used for required backend role: [" + requiredRole + "], fixture [" + this.meta.name + "]"
                
                if (!backend.meta.does(requiredRole)) return false
            }, this)
        }
        
    },
    
    
    continued : {
        
        methods : {
            
            run : function () {
                var handle      = this.init()
                
                var skipMe      = this.checkSkip(handle)
                
                if (skipMe) {
//                    this.t.skip("")
                    this.CONTINUE()
                }
                
                this.populate(handle).then(function () {
                    
                    
                    this.TRY(function () {
                        
                        this.verify(handle).now()
                        
                    }).CATCH(function (e) {
                        
                        this.t.fail('Exception [' + e + '] caught during `verify` of fixture: [' + this.meta.name + ']')
                        
                        this.CONTINUE()
                    }).now()
                }).now()
            },
        
        
            populate : function (handle) {
                throw "Abstract method `populate` of `KiokuJS.Test.Fixture` reached"
            },
            
            
            verify : function (handle) {
                throw "Abstract method `verify` of `KiokuJS.Test.Fixture` reached"
            }
        }
    }

})

