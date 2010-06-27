StartTest(function(t) {
    
	t.plan(8)
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS', 'KiokuJS.Backend.Hash' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,               "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,     "'KiokuJS.Collapser' is here")
        
        
        Class('Some.Class', {
            
            has : {
                ref    : null
            }
        })

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        var instance = new Some.Class()
        
        instance.ref = instance
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapsing')

        var collapser = new KiokuJS.Collapser({
            resolver            : new KiokuJS.Resolver.Standard(),
            backend             : new KiokuJS.Backend.Hash()
        })
        
        
        var nodes = collapser.collapse({}, [ instance ])
        
        t.ok(nodes.length == 1, 'Correct number of nodes was returned')
        
        var node   = nodes[0]

        t.ok(node.object === instance, '`node` has correct object')
        t.ok(node.isRoot, '`node` is in the root objects set')
        
        
        var refNode   = node.data.ref
        
        t.ok(refNode === node, 'Self-referencing node was collapsed correctly')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Checking entries')
        
        var entry       = node.getEntry()
        var entryData   = entry.data
        
        t.ok(entry.ID == node.ID, "Node's entry has correct ID")
        
        t.ok(entryData.ref.$ref == node.ID, 'Self-reference was correctly serialized')
        
        t.endAsync(async0)
    })
})    