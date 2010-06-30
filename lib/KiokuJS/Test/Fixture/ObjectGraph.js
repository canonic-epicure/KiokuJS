Class('KiokuJS.Test.Fixture.ObjectGraph', {
    
    use     : 'KiokuJS.Test.Person',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    has : {
        sort                    : 1
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle) {
                throw "Abstract method `populate` of `KiokuJS.Test.Fixture` reached"
            },
            
            
            verify : function (handle) {
                throw "Abstract method `verify` of `KiokuJS.Test.Fixture` reached"
            }
        }
    }

})



StartTest(function(t) {
    
	t.plan(16)
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS', 'Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS, "'KiokuJS' is here")
        t.ok(Person, "'Person' is here")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        var Homer = new Person({
            name    : 'Homer Simpson'
        })
        
        var Marge = new Person({
            name    : 'Marge Simpson'
        })
        
        var Bart = new Person({
            name    : 'Bart Simpson'
        })
        
        var Lisa = new Person({
            name    : 'Lisa Simpson'
        })
        
        
        Homer.spouse    = Marge
        Marge.spouse    = Homer
        
        Bart.farther    = Lisa.farther  = Homer
        Bart.mother     = Lisa.mother   = Marge
        
        var kids = [ Bart, Lisa ]
        
        Homer.children = Marge.children = kids
        

        //======================================================================================================================================================================================================================================================
        t.diag('Handler setup')
        
        var DB = new KiokuJS({
            backend : new KiokuJS.Backend.Hash()
        })
        
        t.ok(DB, "KiokuJS handler was instantiated")
        
        
        var scope = DB.newScope()
        
        
        scope.store(Homer).then(function (homerID) {
            
            scope.lookUp(homerID).then(function (homer2) {
                
                //======================================================================================================================================================================================================================================================
                t.diag('Retrieving live object')
                
                
                t.ok(homer2 === Homer, 'Retrieved the Homer object from live objects')
                
                
                var newScope = DB.newScope()
                
                newScope.lookUp(homerID).then(function (homer3) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving from backend')
                
                    
                    t.ok(homer3 !== Homer, 'Retrieved Homer is another instance already')
                    
                    t.ok(homer3.name == 'Homer Simpson', 'But it has a correct name')
                    
                    
                    var marge3 = homer3.spouse
                    
                    t.ok(marge3 instanceof Person, 'Marge2 isa Person')
                    t.ok(marge3.name == 'Marge Simpson', 'Marge has a correct name')
                    
                    t.ok(marge3.spouse === homer3, 'Marge2&Homer2 are spouses')
                    
                    t.ok(marge3.children === homer3.children, 'Marge2&Homer2 have correct kids')
                    
                    
                    
                    var kids = marge3.children
                    
                    t.ok(kids.length == 2, 'we forgot Maggy..')
                    
                    t.ok((kids[0] instanceof Person) && (kids[1] instanceof Person), 'Both kids are Persons')
                    
                    var bart3 = kids[0]
                    var lisa3 = kids[1]
                    
                    t.ok(bart3.name == 'Bart Simpson', 'First kid in array is Bart')
                    t.ok(lisa3.name == 'Lisa Simpson', 'Second kid in array is Lisa')
                    
                    t.ok(bart3.farther == homer3 && bart3.mother == marge3, 'Bart3 has correct parents')
                    t.ok(lisa3.farther == homer3 && lisa3.mother == marge3, 'Bart3 has correct parents')
                    
                    
                    t.endAsync(async0)
                }).now()
            }).now()
        }).now()
    })
})    