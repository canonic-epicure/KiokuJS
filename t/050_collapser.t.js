StartTest(function(t) {
    
	t.plan(1)
    
    var async0 = t.beginAsync()
    
    use([ 'JiojuDB', 'JiojuDB.Backend.Hash', 'Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(JiojuDB,               "'JiojuDB' is here")
        t.ok(JiojuDB.Collapser,     "'JiojuDB.Collapser' is here")
        t.ok(Person,                "'Person' is here")

        
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
        t.diag('Collapser setup')
        
        var backend     = new JiojuDB.Backend.Hash()
        
        var collapser = new JiojuDB.Collapser({
            resolver            : new JiojuDB.Resolver.Standard(),
            inliner             : backend.inliner
        })
        
        t.ok(collapser, "JiojuDB collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 5, 'Correct number of nodes is returned (`kids` array is shared)')
        
//        handler.store(Homer).then(function (homerID) {
//            
////            debugger
//            
//            var HomerCopy = handler.lookUp(homerID)
//            
//            // HomerCopy === Homer
//            // HomerCopy.spouse === Marge
//            // etc
//            
//            t.endAsync(async0)
//        }).now()
    })
})    