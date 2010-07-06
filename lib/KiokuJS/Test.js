Class('KiokuJS.Test', {
    
    trait   : 'JooseX.CPS',
    
    
    has : {
        t               : { required : true },
        init            : { required : true },
        
        fixtures        : [
            'ObjectGraph'
        ]
    },
    
    
    methods : {
        
        expandFixturesNames : function () {
            return Joose.A.map(this.fixtures, function (fixture) {
                if (!/^=/.test(fixture)) fixture += 'KiokuJS.Test.Fixture.'
                
                return fixture
            })
        }
    },
    
        
    continued : {
        
        methods : {
            
            runAllFixtures : function () {
                this.loadFixtures().then(function () {
                    
                    var fixtures = Joose.A.map(this.expandFixturesNames(), function (fixtureName) {
                        var constructor = eval(fixtureName)
                        
                        return new constructor({
                            t       : this.t,
                            init    : this.init
                        })
                    }, this)
                    
                    fixtures.sort(function (a, b) {
                        
                        return a.sort - b.sort
                    })
                    
                    this.runFixtures(fixtures).now()
                    
                }).now()
            },
            
            
            runFixtures : function (fixtures) {
                if (fixtures.length) {
                    var fixture = fixtures.shift()
                    
                    fixture.run().then(function () {
                        
                        this.runFixtures(fixtures).now()
                    }, this)
                } else
                    this.CONTINUE()
            },
            
            
            loadFixtures : function () {
                use(this.expandFixturesNames(), this.getCONTINUE())
            }
        }
    }

})

