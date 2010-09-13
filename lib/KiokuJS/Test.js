Class('KiokuJS.Test', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        t               : { required : true },
        
        connect         : { required : true },
        cleanup         : null,
        
        skipCleanup     : false,
        
        fixtures        : {
            init : [
                'ObjectGraph',
                'Refresh',
                'Update',
                'Remove',
                'Traits',
                'Intrinsic',
                'Immutable',
                'Proxy',
                'BackendFeature.Overwrite',
                'StressLoad.Tree'
            ]
        }
    },
    
    
    methods : {
        
        expandFixturesNames : function () {
            return Joose.A.map(this.fixtures, function (fixture) {
                if (!/^=/.test(fixture)) fixture = 'KiokuJS.Test.Fixture.' + fixture
                
                return fixture
            })
        }
    },
    
        
    continued : {
        
        methods : {
            
            runAllFixtures : function () {
                this.loadFixtures().andThen(function () {
                    
                    var fixtures = Joose.A.map(this.expandFixturesNames(), function (fixtureName) {
                        var constructor = eval(fixtureName)
                        
                        return new constructor({
                            t           : this.t,
                            
                            connect     : this.connect,
                            cleanup     : this.cleanup,
                            
                            skipCleanup : this.skipCleanup
                        })
                    }, this)
                    
                    fixtures.sort(function (a, b) {
                        
                        return a.sort - b.sort
                    })
                    
                    this.runFixtures(fixtures).now()
                })
            },
            
            
            runFixtures : function (fixtures) {
                var me = this
                
                Joose.A.each(fixtures, function (fixture) {
                    
                    me.THEN(function () {
                        
                        fixture.run().now()
                    })
                })
                
                if (fixtures.length)
                    this.NOW()
                else
                    this.CONTINUE()
            },
            
            
            loadFixtures : function () {
                use(this.expandFixturesNames(), this.getCONTINUE())
            }
        }
    }

})

