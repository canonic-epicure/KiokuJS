StartTest(function(t) {
    
	t.plan(14)
    
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
            
            scope.lookUp(homerID).then(function (homerCopy) {
                
                //======================================================================================================================================================================================================================================================
                t.diag('Retrieving live object')
                
                
                t.ok(homerCopy === Homer, 'Retrieved the Homer object from live objects')
                
                
                var newScope = DB.newScope()
                
                newScope.lookUp(homerID).then(function (homerCopy2) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Retrieving from backend')
                
                    
                    t.ok(homerCopy2 !== Homer, 'Retrieved Homer is another instance already')
                    
                    t.ok(homerCopy2.name == 'Homer Simpson', 'But it has a correct name')
                    
                    
                    var margeCopy2 = homerCopy2.spouse
                    
                    t.ok(margeCopy2 instanceof Person, 'Marge2 isa Person')
                    t.ok(margeCopy2.name == 'Marge Simpson', 'Marge has a correct name')
                    
                    t.ok(margeCopy2.spouse === homerCopy2, 'Marge2&Homer2 are spouses')
                    
                    t.ok(margeCopy2.children === homerCopy2.children, 'Marge2&Homer2 have correct kids')
                    
                    
                    
                    var kids = margeCopy2.children
                    
                    t.ok(kids.length == 2, 'we forgot Maggy..')
                    
                    t.ok((kids[0] instanceof Person) && (kids[1] instanceof Person), 'Both kids are Persons')
                    
                    t.ok(kids[0].name == 'Bart Simpson', 'First kid in array is Bart')
                    t.ok(kids[1].name == 'Lisa Simpson', 'Second kid in array is Lisa')
                    
                    
                    t.endAsync(async0)
                }).now()
            }).now()
        }).now()
    })
})    