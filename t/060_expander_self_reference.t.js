StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS', 'KiokuJS.Linker.Expander', 'KiokuJS.Backend.Hash' ], function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS,               "'KiokuJS' is here")
        t.ok(KiokuJS.Collapser,     "'KiokuJS.Collapser' is here")
        
        
        Class('Some.Class', {
            
            has : {
                $ref    : null,
                $entry  : null
            }
        })

        
        //======================================================================================================================================================================================================================================================
        t.diag('Graph setup')
        
        
        var instance = new Some.Class()
        
        instance.$ref   = instance
        instance.$entry = '123'
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Collapsing')

        var collapser = new KiokuJS.Collapser({
            resolver            : new KiokuJS.Resolver.Standard(),
            backend             : new KiokuJS.Backend.Hash()
        })
        
        var nodes   = collapser.collapse({}, [ instance ])
        var node    = nodes[0]

        
        //======================================================================================================================================================================================================================================================
        t.diag('Expanding entries')
        
        var scope       = new KiokuJS.Scope({
            backend     : collapser.backend,
            resolver    : collapser.resolver
        })
        
        var entry       = node.getEntry()
        entry.backend   = collapser.backend
        
        var nodesObject = {}
        
        nodesObject[ node.ID ] = new KiokuJS.Node(entry)
        
        
        var objects     = KiokuJS.Linker.Expander.expandNodes(nodesObject, scope)
        
        var object      = objects[ node.ID ]
        
        t.ok(object, 'Something was expanded into objects')
        
        t.ok(object instanceof Some.Class, "And its an instance of correct class")
        
        
        t.ok(object != instance, 'Its a different, newly created instance')
        t.ok(object.$ref == object, 'And it has a correct self-referencing attribute (in `$ref` attributes)')
        t.ok(object.$entry == '123', 'And it has a correct value for `$entry` property')
        
        t.endAsync(async0)
        
        t.done()
    })
})    