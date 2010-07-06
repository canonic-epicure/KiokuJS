StartTest(function(t) {
    
	t.plan(65)
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS', 'KiokuJS.Backend.Hash', 'KiokuJS.Test.Person' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,               "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,     "'KiokuJS.Collapser' is here")
        t.ok(Person,                "'Person' is here")

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        var Homer = new KiokuJS.Test.Person({
            name    : 'Homer Simpson'
        })
        
        var Marge = new KiokuJS.Test.Person({
            name    : 'Marge Simpson'
        })
        
        var Bart = new KiokuJS.Test.Person({
            name    : 'Bart Simpson'
        })
        
        var Lisa = new KiokuJS.Test.Person({
            name    : 'Lisa Simpson'
        })
        
        
        Homer.spouse(Marge)
        Marge.spouse(Homer)
        
        Bart.farther    = Lisa.farther  = Homer
        Bart.mother     = Lisa.mother   = Marge
        
        var kids = [ Bart, Lisa ]
        
        Homer.children = Marge.children = kids
        

        //======================================================================================================================================================================================================================================================
        t.diag('Collapser setup')
        
        var backend     = new KiokuJS.Backend.Hash()
        
        var collapser = new KiokuJS.Collapser({
            resolver            : new KiokuJS.Resolver.Standard(),
            backend             : backend
        })
        
        t.ok(collapser, "KiokuJS collapser was instantiated")
        

        //======================================================================================================================================================================================================================================================
        t.diag('Extracting first-class nodes from graph')
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 5, 'Correct number of nodes is returned (`kids` array is shared, thus has its own node)')
        
        
        var homerNode   = nodes[0]
        var margeNode   = homerNode.data.spouse
        var kidsNode1   = homerNode.data.children
        var kidsNode2   = margeNode.data.children
        
        
        t.ok(homerNode.object === Homer, 'Homer is the object of the 1st node')
        t.ok(margeNode.object === Marge, 'Marge is the object of the `margeNode`')
        t.ok(kidsNode1 === kidsNode2, 'Kids node is shared')
        
        
        var bartNode    = kidsNode1.data[0]
        var lisaNode    = kidsNode1.data[1]
        
        t.ok(bartNode.object === Bart, 'Bart is the object of the `bartNode`')
        t.ok(lisaNode.object === Lisa, 'Lisa is the object of the `lisaNode`')
        

        t.ok(lisaNode.data.farther === homerNode, 'Lisa is the daugther of Homer (through the nodes relationship)')
        t.ok(lisaNode.data.mother === margeNode, 'Lisa is the daugther of Marge (through the nodes relationship)')
        
        t.ok(bartNode.data.farther === homerNode, 'Bart is the son of Homer (through the nodes relationship)')
        t.ok(bartNode.data.mother === margeNode, 'Bart is the son of Marge (through the nodes relationship)')
        
        t.ok(homerNode.isRoot, 'Homer is in the root objects set')
        t.ok(!margeNode.isRoot, 'Marge is not in the root objects set')
        t.ok(!bartNode.isRoot, 'Bart is not in the root objects set')
        t.ok(!lisaNode.isRoot, 'Lisa is not in the root objects set')
        t.ok(!kidsNode1.isRoot, '`kids` is not in the root objects set')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var entry       = homerNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == homerNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'Person', 'Entry has correct `className`')
        
        t.ok(data.name == 'Homer Simpson', 'Entry has correct name')
        t.ok(data.spouse.$ref == margeNode.ID, 'Entry has correct `spouse` ref')
        t.ok(data.children.$ref == kidsNode1.ID, 'Entry has correct `children` ref')
        
        
        var entry       = margeNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == margeNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'Person', 'Entry has correct `className`')
        
        t.ok(data.name == 'Marge Simpson', 'Entry has correct name')
        t.ok(data.spouse.$ref == homerNode.ID, 'Entry has correct `spouse` ref')
        t.ok(data.children.$ref == kidsNode1.ID, 'Entry has correct `children` ref')
        

        var entry       = kidsNode1.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == kidsNode1.ID, 'Entry has correct ID')
        t.ok(entry.className == 'Array', 'Entry has correct `className`')
        
        t.ok(data[0].$ref == bartNode.ID, 'Entry has correct first element')
        t.ok(data[1].$ref == lisaNode.ID, 'Entry has correct second element')
        
        
        var entry       = bartNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == bartNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'Person', 'Entry has correct `className`')
        
        t.ok(data.farther.$ref == homerNode.ID, 'Entry has correct `farther` ref')
        t.ok(data.mother.$ref == margeNode.ID, 'Entry has correct `mother` ref')

        
        var entry       = lisaNode.getEntry()
        var data        = entry.data
        
        t.ok(entry.ID == lisaNode.ID, 'Entry has correct ID')
        t.ok(entry.className == 'Person', 'Entry has correct `className`')
        
        t.ok(data.farther.$ref == homerNode.ID, 'Entry has correct `farther` ref')
        t.ok(data.mother.$ref == margeNode.ID, 'Entry has correct `mother` ref')
        
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapsing with intrinsic entries, repeating collapsing')
        
        Homer.children = [ Bart, Lisa ]
        Marge.children = [ Bart, Lisa ]
        
        
        var collapser = new KiokuJS.Collapser({
            resolver            : new KiokuJS.Resolver.Standard(),
            backend             : backend
        })
        
        
        var nodes = collapser.collapse({}, [ Homer ])
        
        t.ok(nodes.length == 4, 'Correct number of nodes is returned (`kids` array is intrinsic)')
        
        
        var homerNode   = nodes[0]
        var margeNode   = homerNode.data.spouse
        var kidsNode1   = homerNode.data.children
        var kidsNode2   = margeNode.data.children
        
        
        t.ok(homerNode.object === Homer, 'Homer is the object of the 1st node')
        t.ok(margeNode.object === Marge, 'Marge is the object of the `margeNode`')
        t.ok(kidsNode1 !== kidsNode2, 'Kids node is not shared')
        
        t.ok(!kidsNode1.isFirstClass(), 'Kids node are not first class this time')
        t.ok(!kidsNode2.isFirstClass(), 'Kids node are not first class this time')
        
        
        var bartNode1    = kidsNode1.data[0]
        var lisaNode1    = kidsNode1.data[1]
        
        var bartNode2    = kidsNode2.data[0]
        var lisaNode2    = kidsNode2.data[1]
        
        t.ok(bartNode1 === bartNode2, 'Bart node is shared between kids nodes')
        t.ok(lisaNode1 === lisaNode2, 'Lisa node is shared between kids nodes')
        
        t.ok(bartNode1.object === Bart, 'Bart is the object of the `bartNode`')
        t.ok(lisaNode1.object === Lisa, 'Lisa is the object of the `lisaNode`')
        

        t.ok(lisaNode1.data.farther === homerNode, 'Lisa is the daugther of Homer (through the nodes relationship)')
        t.ok(lisaNode1.data.mother === margeNode, 'Lisa is the daugther of Marge (through the nodes relationship)')
        
        t.ok(bartNode1.data.farther === homerNode, 'Bart is the son of Homer (through the nodes relationship)')
        t.ok(bartNode1.data.mother === margeNode, 'Bart is the son of Marge (through the nodes relationship)')
        
        t.ok(homerNode.isRoot, 'Homer is in the root objects set')
        t.ok(!margeNode.isRoot, 'Marge is not in the root objects set')
        t.ok(!bartNode.isRoot, 'Bart is not in the root objects set')
        t.ok(!lisaNode.isRoot, 'Lisa is not in the root objects set')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var entry       = homerNode.getEntry()
        var data        = entry.data
        
        
        t.ok(data.children.className == 'Array', 'Entry has correct intrinsic `children` entry')
        
        t.ok(data.children.data[0].$ref == bartNode.ID, 'Entry has correct ref to Bart node')
        t.ok(data.children.data[1].$ref == lisaNode.ID, 'Entry has correct ref to Lisa node')
        

        var entry       = margeNode.getEntry()
        var data        = entry.data
        
        
        t.ok(data.children.className == 'Array', 'Entry has correct intrinsic `children` entry')
        
        t.ok(data.children.data[0].$ref == bartNode.ID, 'Entry has correct ref to Bart node')
        t.ok(data.children.data[1].$ref == lisaNode.ID, 'Entry has correct ref to Lisa node')
        
        
        t.endAsync(async0)
    })
})    