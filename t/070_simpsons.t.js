StartTest(function(t) {
    
	t.plan(3)
    
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
        
        
        var scope = DB.root()
        
        
        scope.store(Homer).then(function (homerID) {
            
            debugger
            
            var HomerCopy = scope.lookUp(homerID)
            
            // HomerCopy === Homer
            // HomerCopy.spouse === Marge
            // etc
            
            t.endAsync(async0)
        }).now()
    })
})    